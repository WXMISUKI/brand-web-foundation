import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";
import type { CollectionBeforeChangeHook, CollectionAfterReadHook } from "payload";

export function plainTextToRichText(value: string): SerializedEditorState {
  return { root: { type: "root", version: 1, direction: null, format: "", indent: 0, children: value.replace(/\r\n?/g, "\n").split("\n").map(line => ({ type: "paragraph", version: 1, direction: null, format: "", indent: 0, textFormat: 0, textStyle: "", children: line ? [{ type: "text", version: 1, text: line, detail: 0, format: 0, mode: "normal", style: "" }] : [] })) } } as SerializedEditorState;
}

export function asRichText(value: unknown): SerializedEditorState | null {
  if (!value || typeof value !== "object" || !("root" in value)) return null;
  const root = value.root;
  if (!root || typeof root !== "object" || !("children" in root) || !Array.isArray(root.children)) return null;
  return value as SerializedEditorState;
}

/** Keep the localized plain-text field in sync for database search. */
export const indexRichBody: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (data && Object.prototype.hasOwnProperty.call(data, "richBody")) {
    const rich = asRichText(data.richBody);
    if (!rich && operation === "create" && typeof data.body === "string" && data.body.trim()) return data;
    data.body = rich ? convertLexicalToPlaintext({ data: rich }) : "";
  }
  return data;
};

/** Preserve editable legacy text in SQLite and records not yet backfilled. */
export const readLegacyBody: CollectionAfterReadHook = ({ doc }) => {
  if (!doc.richBody && typeof doc.body === "string" && doc.body.trim()) doc.richBody = plainTextToRichText(doc.body);
  return doc;
};
