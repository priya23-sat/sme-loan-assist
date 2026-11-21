import { parseBoiStatementText, type BankStatementParseResult, type BankStatementTransaction } from "./boi-statement-parser";

export interface ExtractedPdfPage {
  pageNumber: number;
  text: string;
}

export interface PdfTextExtractor {
  extractPages(pdfBytes: Uint8Array): Promise<ExtractedPdfPage[]>;
}

export interface OcrPageResult {
  text: string;
  /** Optional provider confidence, 0..1. This is kept separate from parser confidence. */
  confidence?: number;
}

export interface OcrAdapter {
  recognizePage(input: { pdfBytes: Uint8Array; pageNumber: number }): Promise<OcrPageResult>;
}

export type PdfPageMethod = "pdf_text" | "ocr";

export interface ProcessedStatementPage {
  pageNumber: number;
  method: PdfPageMethod;
  textLength: number;
  ocrConfidence: number | null;
}

export interface ProcessBoiPdfResult {
  extractionMethod: "pdf_text" | "ocr" | "mixed";
  pages: ProcessedStatementPage[];
  parse: BankStatementParseResult;
}

const MIN_USABLE_TEXT_CHARS = 24;

function hasUsableText(text: string): boolean {
  return (text.match(/[A-Za-z0-9]/g) ?? []).length >= MIN_USABLE_TEXT_CHARS;
}

function toPaise(value: string): bigint {
  const [rupees, fraction = ""] = value.replaceAll(",", "").split(".");
  return BigInt(rupees ?? "0") * 100n + BigInt(fraction.padEnd(2, "0"));
}

function fromPaise(value: bigint): string {
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  return `${negative ? "-" : ""}${absolute / 100n}.${(absolute % 100n).toString().padStart(2, "0")}`;
}

/**
 * PDF orchestration is deliberately adapter-based. Supply a server-side PDF text
 * extractor and, when needed, an OCR adapter. No provider SDK or secret belongs
 * in this module or in browser code.
 */
export async function processBoiStatementPdf(
  pdfBytes: Uint8Array,
  dependencies: { pdf: PdfTextExtractor; ocr?: OcrAdapter },
): Promise<ProcessBoiPdfResult> {
  if (pdfBytes.byteLength === 0) throw new Error("The selected PDF is empty.");

  const extractedPages = await dependencies.pdf.extractPages(pdfBytes);
  if (extractedPages.length === 0) throw new Error("No pages could be read from this PDF.");

  const pages: ProcessedStatementPage[] = [];
  const pageResults: BankStatementParseResult[] = [];

  for (const page of extractedPages) {
    if (!Number.isInteger(page.pageNumber) || page.pageNumber < 1) {
      throw new Error("PDF extractor returned an invalid page number.");
    }

    let text = page.text;
    let method: PdfPageMethod = "pdf_text";
    let ocrConfidence: number | null = null;

    if (!hasUsableText(text)) {
      if (!dependencies.ocr) {
        throw new Error(`Page ${page.pageNumber} appears to be scanned. Configure an OCR adapter to process it.`);
      }
      const recognised = await dependencies.ocr.recognizePage({
        pdfBytes,
        pageNumber: page.pageNumber,
      });
      text = recognised.text;
      method = "ocr";
      ocrConfidence = recognised.confidence ?? null;
      if (ocrConfidence !== null && (ocrConfidence < 0 || ocrConfidence > 1)) {
        throw new Error("OCR adapter confidence must be between 0 and 1.");
      }
    }

    pages.push({
      pageNumber: page.pageNumber,
      method,
      textLength: text.length,
      ocrConfidence,
    });
    pageResults.push(parseBoiStatementText(text, page.pageNumber));
  }

  const transactions: BankStatementTransaction[] = pageResults.flatMap((result) => result.transactions);
  const firstWithOpening = pageResults.find((result) => result.openingBalance !== null);
  const lastWithClosing = [...pageResults].reverse().find((result) => result.closingBalance !== null);
  const openingBalance = firstWithOpening?.openingBalance ?? null;
  const closingBalance = lastWithClosing?.closingBalance ?? null;

  let expectedClosingBalance: string | null = null;
  let delta: string | null = null;
  let reconciliation: BankStatementParseResult["reconciliation"]["status"] = "not_available";
  if (openingBalance !== null && closingBalance !== null && transactions.length > 0) {
    let running = toPaise(openingBalance);
    for (const transaction of transactions) {
      running += toPaise(transaction.credit) - toPaise(transaction.debit);
    }
    expectedClosingBalance = fromPaise(running);
    const difference = running - toPaise(closingBalance);
    delta = fromPaise(difference);
    reconciliation = difference === 0n ? "matched" : "mismatch";
  }

  const periodFrom = pageResults.find((result) => result.statementPeriod.from !== null)?.statementPeriod.from ?? null;
  const periodTo = [...pageResults].reverse().find((result) => result.statementPeriod.to !== null)?.statementPeriod.to ?? null;
  const warnings = pageResults.flatMap((result) => result.warnings).filter((warning) =>
    warning !== "Statement period was not recognised." || (periodFrom === null && periodTo === null),
  );
  if (reconciliation === "mismatch") {
    warnings.push("Closing balance does not reconcile with opening balance and extracted transactions.");
  }

  const methods = new Set(pages.map((page) => page.method));
  const extractionMethod = methods.size > 1 ? "mixed" : methods.has("ocr") ? "ocr" : "pdf_text";

  return {
    extractionMethod,
    pages,
    parse: {
      bankFormatKey: "boi_retail_sme_v1",
      currency: "INR",
      accountHolder: pageResults.find((result) => result.accountHolder !== null)?.accountHolder ?? null,
      statementPeriod: { from: periodFrom, to: periodTo },
      openingBalance,
      closingBalance,
      transactions,
      reconciliation: {
        status: reconciliation,
        expectedClosingBalance,
        actualClosingBalance: closingBalance,
        delta,
      },
      warnings: [...new Set(warnings)],
    },
  };
}
