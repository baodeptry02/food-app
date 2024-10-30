// convertRichTextToPlainText.js
export function convertRichTextToPlainText(richText) {
  if (!Array.isArray(richText)) {
    throw new Error("Input must be an array");
  }

  return richText.map((block) => block.text).join(" ");
}
