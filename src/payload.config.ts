import path from "node:path";
import { buildConfig, type CollectionConfig, type GlobalConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor, LinkFeature } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import { defaultLocale, locales } from "./i18n/locales.ts";
import { indexRichBody, readLegacyBody } from "./content/rich-text.ts";
import { heroHref } from "./data/hero-link.ts";
import { migrations } from "./migrations/index.ts";

const authenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);
const contentAccess = { read: () => true, create: authenticated, update: authenticated, delete: authenticated };
const productAccess = { read: authenticated, create: authenticated, update: authenticated, delete: authenticated };
const mediaDir = path.resolve(/* turbopackIgnore: true */ process.env.PAYLOAD_MEDIA_DIR || path.join(process.cwd(), ".local", "media"));
const Users: CollectionConfig = { slug: "users", auth: true, fields: [] };
const Inquiries: CollectionConfig = {
  slug: "inquiries",
  labels: { singular: "Product inquiry", plural: "Product inquiries" },
  access: {
    read: authenticated,
    create: ({ data }) => {
      const row = data && typeof data === "object" ? data as Record<string, unknown> : {};
      return process.env.INQUIRY_MODE === "enabled" && !row.website;
    },
    update: authenticated,
    delete: authenticated,
  },
  admin: { useAsTitle: "email" },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "country", type: "text" },
    { name: "phone", type: "text" },
    { name: "role", type: "text" },
    { name: "message", type: "textarea", required: true },
    { name: "locale", type: "select", options: locales.map(locale => locale.code), defaultValue: defaultLocale },
    { name: "sourcePath", type: "text" },
    { name: "consent", type: "checkbox", required: true },
    { name: "status", type: "select", options: ["new", "in-progress", "qualified", "closed", "spam"], defaultValue: "new" },
    { name: "ownerNote", type: "textarea" },
    { name: "website", type: "text", admin: { hidden: true } },
  ],
};
const Media: CollectionConfig = {
  slug: "media", access: contentAccess,
  upload: { staticDir: mediaDir, mimeTypes: ["image/jpeg", "image/png", "image/webp"] },
  fields: [{ name: "alt", type: "text", localized: true, required: true }],
};
const Categories: CollectionConfig = {
  slug: "categories", access: contentAccess, admin: { useAsTitle: "name" },
  fields: [{ name: "slug", type: "text", required: true, unique: true }, { name: "name", type: "text", required: true, localized: true }],
};
const Products: CollectionConfig = {
  slug: "products", access: productAccess, admin: { useAsTitle: "name" },
  hooks: { afterRead: [({ doc, req }) => {
    if (!req.user && doc && typeof doc === "object") {
      const publicDoc = doc as Record<string, unknown>;
      for (const field of ["sourceUrl", "sourceRelatedPages", "sourceNote", "reviewStatus", "assetStatus", "claimsVerified"]) delete publicDoc[field];
    }
    return doc;
  }] },
  fields: [
    { name: "slug", type: "text", required: true, unique: true },
    { name: "category", type: "relationship", relationTo: "categories", required: true },
    { name: "name", type: "text", required: true, localized: true },
    { name: "intro", type: "textarea", localized: true },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "materials", type: "textarea", localized: true },
    { name: "packaging", type: "textarea", localized: true },
    { name: "uses", type: "textarea", localized: true },
    { name: "instructions", type: "textarea", localized: true },
    { name: "sourceUrl", type: "text", access: { read: authenticated }, admin: { description: "Authorised source URL for the draft content." } },
    { name: "sourcePages", type: "array", admin: { description: "Page numbers in the source brochure." }, fields: [{ name: "page", type: "number", required: true, min: 1 }] },
    { name: "sourceRelatedPages", type: "array", access: { read: authenticated }, admin: { description: "Adjacent brochure candidates or context pages kept for provenance." }, fields: [
      { name: "page", type: "number", required: true, min: 1 },
      { name: "role", type: "select", required: true, options: ["excluded-candidate", "cross-page-context"] },
      { name: "note", type: "textarea" },
    ] },
    { name: "sourcePreviewPath", type: "text", admin: { description: "Page preview path captured from the owner-provided brochure." } },
    { name: "sourceDetailPreviewPath", type: "text", admin: { description: "Optional single-page crop used for product detail provenance preview." } },
    { name: "sourceNote", type: "textarea", access: { read: authenticated }, admin: { description: "Provenance note; keep until owner review is complete." } },
    { name: "reviewStatus", type: "select", access: { read: authenticated }, defaultValue: "owner-review", options: ["draft", "owner-review", "approved", "rejected", "asset-pending"] },
    { name: "assetStatus", type: "select", access: { read: authenticated }, defaultValue: "generated-placeholder", options: ["generated-placeholder", "owner-supplied", "authorized-example", "pending"] },
    { name: "claimsVerified", type: "checkbox", access: { read: authenticated }, defaultValue: false },
    { name: "specifications", type: "array", fields: [
      { name: "label", type: "text", required: true, localized: true },
      { name: "unit", type: "text" }, { name: "typical", type: "text" },
      { name: "minimum", type: "text" }, { name: "maximum", type: "text" },
    ] },
  ],
};
const News: CollectionConfig = {
  slug: "news", access: contentAccess, admin: { useAsTitle: "title" },
  hooks: { beforeChange: [indexRichBody], afterRead: [readLegacyBody] },
  fields: [
    { name: "slug", type: "text", required: true, unique: true },
    { name: "kind", type: "select", defaultValue: "news", options: ["news", "event"] },
    { name: "title", type: "text", required: true, localized: true },
    { name: "summary", type: "textarea", localized: true },
    { name: "body", type: "textarea", localized: true, admin: { hidden: true } },
    { name: "richBody", type: "richText", localized: true },
    { name: "publishedOn", type: "date" },
    { name: "image", type: "upload", relationTo: "media" },
  ],
};
const Insights: CollectionConfig = {
  slug: "insights", labels: { singular: "Knowledge article", plural: "Knowledge articles" },
  access: contentAccess, admin: { useAsTitle: "title" },
  hooks: { beforeChange: [indexRichBody], afterRead: [readLegacyBody] },
  fields: [
    { name: "slug", type: "text", required: true, unique: true },
    { name: "title", type: "text", required: true, localized: true },
      { name: "topics", type: "array", fields: [{ name: "slug", type: "text", required: true }] },
    { name: "summary", type: "textarea", localized: true },
    { name: "body", type: "textarea", localized: true, admin: { hidden: true } },
    { name: "richBody", type: "richText", localized: true },
    { name: "author", type: "text", localized: true },
    { name: "publishedOn", type: "date" },
    { name: "image", type: "upload", relationTo: "media" },
  ],
};
const Cases: CollectionConfig = {
  slug: "cases", labels: { singular: "Growing story", plural: "Growing stories" },
  access: contentAccess, admin: { useAsTitle: "title" },
  hooks: { beforeChange: [indexRichBody], afterRead: [readLegacyBody] },
  fields: [
    { name: "slug", type: "text", required: true, unique: true },
    { name: "title", type: "text", required: true, localized: true },
    { name: "summary", type: "textarea", localized: true },
    { name: "body", type: "textarea", localized: true, admin: { hidden: true } },
    { name: "richBody", type: "richText", localized: true },
    { name: "publishedOn", type: "date" },
    { name: "image", type: "upload", relationTo: "media" },
  ],
};
const CropGuides: CollectionConfig = {
  slug: "crop-guides", labels: { singular: "Crop guide", plural: "Crop guides" },
  access: contentAccess, admin: { useAsTitle: "slug" },
  fields: [
    { name: "slug", type: "text", required: true, unique: true },
    { name: "status", type: "select", defaultValue: "owner-review", options: ["draft", "owner-review", "approved", "rejected"] },
    { name: "nav", type: "text", localized: true, required: true },
    { name: "overview", type: "textarea", localized: true },
    { name: "stages", type: "text", localized: true },
    { name: "stagesText", type: "textarea", localized: true },
    { name: "nutrition", type: "textarea", localized: true },
    { name: "products", type: "textarea", localized: true },
    { name: "browse", type: "text", localized: true },
    { name: "resources", type: "text", localized: true },
    { name: "resourcesText", type: "textarea", localized: true },
    { name: "sections", type: "array", maxRows: 5, fields: [{ name: "key", type: "text", required: true }, { name: "title", type: "text", localized: true, required: true }] },
  ],
};
const FaqGroups: CollectionConfig = {
  slug: "faq-groups", labels: { singular: "FAQ category", plural: "FAQ categories" },
  access: contentAccess, admin: { useAsTitle: "name" },
  fields: [
    { name: "slug", type: "text", required: true, unique: true },
    { name: "name", type: "text", required: true, localized: true },
    { name: "sortOrder", type: "number", defaultValue: 0 },
  ],
};
const Faqs: CollectionConfig = {
  slug: "faqs", labels: { singular: "FAQ", plural: "FAQs" },
  access: contentAccess, admin: { useAsTitle: "question" },
  fields: [
    { name: "group", type: "relationship", relationTo: "faq-groups", required: true },
    { name: "question", type: "text", required: true, localized: true },
    { name: "answer", type: "textarea", localized: true },
    { name: "sortOrder", type: "number", defaultValue: 0 },
  ],
};
const CompanyProfile: GlobalConfig = {
  slug: "company-profile", label: "Company profile",
  access: { read: () => true, update: authenticated },
  fields: [
    { name: "title", type: "text", localized: true },
    { name: "summary", type: "textarea", localized: true },
    { name: "description", type: "textarea", localized: true },
    { name: "legalName", type: "text", localized: true },
    { name: "email", type: "email" },
    { name: "whatsapp", type: "text" },
    { name: "address", type: "text", localized: true },
    { name: "banner", type: "upload", relationTo: "media" },
    { name: "focusAreas", type: "array", maxRows: 12, fields: [
      { name: "title", type: "text", localized: true },
      { name: "description", type: "textarea", localized: true },
    ] },
    { name: "milestones", type: "array", maxRows: 100, fields: [
      { name: "period", type: "text" },
      { name: "title", type: "text", localized: true },
      { name: "description", type: "textarea", localized: true },
      { name: "image", type: "upload", relationTo: "media" },
    ] },
  ],
};
const Homepage: GlobalConfig = {
  slug: "homepage", label: "Homepage slides",
  access: { read: () => true, update: authenticated },
  fields: [{ name: "slides", type: "array", maxRows: 12, fields: [
    { name: "eyebrow", type: "text", localized: true },
    { name: "title", type: "text", localized: true },
    { name: "description", type: "textarea", localized: true },
    { name: "actionLabel", type: "text", localized: true },
    { name: "actionPath", type: "text", admin: { description: "Site-relative path without language prefix, e.g. /products or /about" }, validate: (value: string | null | undefined) => !value || heroHref("en", value) ? true : "Enter a site-relative path without a language prefix." },
    { name: "image", type: "upload", relationTo: "media" },
  ] }, { name: "featured", type: "array", maxRows: 6, fields: [
    { name: "title", type: "text", localized: true },
    { name: "description", type: "textarea", localized: true },
    { name: "actionLabel", type: "text", localized: true },
    { name: "actionPath", type: "text", admin: { description: "Site-relative path without language prefix, e.g. /products or /about" }, validate: (value: string | null | undefined) => !value || heroHref("en", value) ? true : "Enter a site-relative path without a language prefix." },
    { name: "image", type: "upload", relationTo: "media" },
  ] }],
};

const secret = process.env.PAYLOAD_SECRET;
if (!secret || secret.length < 32) throw new Error("PAYLOAD_SECRET must be configured with at least 32 characters");
const database = process.env.PAYLOAD_DATABASE || (process.env.NODE_ENV === "production" ? "postgres" : "sqlite");
if (database !== "sqlite" && database !== "postgres") throw new Error("Unsupported PAYLOAD_DATABASE");
if (process.env.NODE_ENV === "production" && database !== "postgres") throw new Error("Production requires PostgreSQL");
if (database === "postgres" && !process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for PostgreSQL");

export default buildConfig({
  secret,
  admin: { user: "users", importMap: { baseDir: path.resolve(process.cwd(), "src") } },
  collections: [Users, Inquiries, Media, Categories, Products, News, Insights, Cases, CropGuides, FaqGroups, Faqs],
  globals: [CompanyProfile, Homepage],
  localization: { locales: locales.map(locale => locale.code), defaultLocale, fallback: false },
  db: database === "postgres" ? postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL! }, migrationDir: path.resolve(process.cwd(), "src", "migrations"), prodMigrations: migrations }) : sqliteAdapter({ client: { url: process.env.PAYLOAD_SQLITE_URL || "file:./.local/payload.sqlite" } }),
  editor: lexicalEditor({ features: ({ defaultFeatures }) => [...defaultFeatures.filter(feature => feature.key !== "link"), LinkFeature({ enabledCollections: ["products", "categories", "insights", "cases", "news"] })] }), sharp,
  typescript: { outputFile: path.resolve(process.cwd(), "src/payload-types.ts") },
});
