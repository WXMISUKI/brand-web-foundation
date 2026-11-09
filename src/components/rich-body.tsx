import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { richInternalHref } from "../data/rich-link";
import type { LocaleCode } from "../i18n/locales";

export function RichBody({ rich, plain, pending, locale }: { rich: SerializedEditorState | null; plain: string | null; pending: string; locale: LocaleCode }) {
  const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    link: args => {
      const { node, nodesToJSX } = args;
      if (node.fields.linkType !== "internal") return typeof defaultConverters.link === "function" ? defaultConverters.link(args) : null;
      const doc = node.fields.doc;
      const href = richInternalHref(locale, doc?.relationTo, doc?.value);
      const children = nodesToJSX({ nodes: node.children });
      return href ? <a href={href} target={node.fields.newTab ? "_blank" : undefined} rel={node.fields.newTab ? "noopener noreferrer" : undefined}>{children}</a> : <span>{children}</span>;
    },
  });
  if (rich) return <div className="rich-body"><RichText data={rich} converters={converters} /></div>;
  return <p className="news-body">{plain ?? pending}</p>;
}
