import { describe, expect, it, vi } from "vitest";
import { processBoiStatementPdf, type PdfTextExtractor } from "./boi-statement-pdf";

const firstPage = [
  "BANK OF INDIA - SYNTHETIC TEST",
  "Account Name: AARAV FOODS (FICTIONAL)",
  "Statement Period: 01/04/2026 to 30/04/2026",
  "Opening Balance: 125,000.00",
  "01/04/2026 UPI CREDIT FROM OMKAR STORES UTR BOI260401001 - 45,000.00 170,000.00",
].join("\n");

const secondPage = [
  "02/04/2026 SUPPLIER PAYMENT NEFT BOI260402002 18,500.00 - 151,500.00",
  "03/04/2026 CASH DEPOSIT BRANCH REF BOI260403003 - 20,000.00 171,500.00",
  "05/04/2026 GST PAYMENT CHALLAN BOI260405004 8,500.00 - 163,000.00",
  "07/04/2026 POS PURCHASE PACKAGING BOI260407005 12,500.00 - 150,500.00",
  "Closing Balance: 150,500.00",
].join("\n");

function pdf(pages: { pageNumber: number; text: string }[]): PdfTextExtractor {
  return { extractPages: vi.fn().mockResolvedValue(pages) };
}

describe("BOI statement PDF processing", () => {
  it("extracts selectable text page by page and preserves provenance", async () => {
    const result = await processBoiStatementPdf(new Uint8Array([1]), {
      pdf: pdf([{ pageNumber: 1, text: firstPage }, { pageNumber: 2, text: secondPage }]),
    });

    expect(result.extractionMethod).toBe("pdf_text");
    expect(result.parse.transactions).toHaveLength(5);
    expect(result.parse.transactions[0]?.sourcePage).toBe(1);
    expect(result.parse.transactions[1]?.sourcePage).toBe(2);
    expect(result.parse.reconciliation.status).toBe("matched");
  });

  it("routes image-only pages to OCR and marks the result as OCR-derived", async () => {
    const ocr = {
      recognizePage: vi.fn().mockResolvedValue({ text: secondPage, confidence: 0.91 }),
    };
    const result = await processBoiStatementPdf(new Uint8Array([1]), {
      pdf: pdf([{ pageNumber: 1, text: firstPage }, { pageNumber: 2, text: "" }]),
      ocr,
    });

    expect(ocr.recognizePage).toHaveBeenCalledWith({ pdfBytes: new Uint8Array([1]), pageNumber: 2 });
    expect(result.extractionMethod).toBe("mixed");
    expect(result.pages[1]).toMatchObject({ method: "ocr", ocrConfidence: 0.91 });
    expect(result.parse.transactions[1]?.sourcePage).toBe(2);
    expect(result.parse.reconciliation.status).toBe("matched");
  });

  it("fails clearly when scanned content has no configured OCR adapter", async () => {
    await expect(processBoiStatementPdf(new Uint8Array([1]), {
      pdf: pdf([{ pageNumber: 1, text: "" }]),
    })).rejects.toThrow("appears to be scanned");
  });

  it("rejects empty PDFs before invoking an extractor", async () => {
    const extractor = pdf([]);
    await expect(processBoiStatementPdf(new Uint8Array(), { pdf: extractor })).rejects.toThrow("PDF is empty");
    expect(extractor.extractPages).not.toHaveBeenCalled();
  });

  it("rejects invalid OCR confidence", async () => {
    await expect(processBoiStatementPdf(new Uint8Array([1]), {
      pdf: pdf([{ pageNumber: 1, text: "" }]),
      ocr: { recognizePage: vi.fn().mockResolvedValue({ text: secondPage, confidence: 1.5 }) },
    })).rejects.toThrow("between 0 and 1");
  });
});
