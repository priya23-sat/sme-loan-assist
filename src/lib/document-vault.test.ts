import { describe, expect, it } from "vitest";
import { MAX_DOCUMENT_BYTES, validateDocument } from "./document-vault";

describe("document upload validation", () => {
  it("accepts PDF, JPEG and PNG documents", () => {
    expect(validateDocument(new File(["pdf"], "bank.pdf", { type: "application/pdf" }))).toBeNull();
    expect(validateDocument(new File(["jpg"], "id.jpg", { type: "image/jpeg" }))).toBeNull();
    expect(validateDocument(new File(["png"], "shop.png", { type: "image/png" }))).toBeNull();
  });

  it("rejects unsupported formats", () => {
    expect(validateDocument(new File(["data"], "statement.exe", { type: "application/octet-stream" }))).toContain("PDF, JPG or PNG");
  });

  it("rejects empty files", () => {
    expect(validateDocument(new File([], "empty.pdf", { type: "application/pdf" }))).toContain("empty");
  });

  it("rejects files larger than 10 MB", () => {
    const large = new File([new Uint8Array(MAX_DOCUMENT_BYTES + 1)], "large.pdf", { type: "application/pdf" });
    expect(validateDocument(large)).toContain("10 MB");
  });
});
