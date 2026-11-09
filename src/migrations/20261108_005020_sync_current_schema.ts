import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_inquiries_locale" AS ENUM('en', 'he', 'nl', 'fr', 'it', 'es', 'pt', 'el', 'zh', 'ro', 'ru', 'th', 'tr');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'in-progress', 'qualified', 'closed', 'spam');
  CREATE TYPE "public"."enum_products_source_related_pages_role" AS ENUM('excluded-candidate', 'cross-page-context');
  CREATE TYPE "public"."enum_products_review_status" AS ENUM('draft', 'owner-review', 'approved', 'rejected', 'asset-pending');
  CREATE TYPE "public"."enum_products_asset_status" AS ENUM('generated-placeholder', 'owner-supplied', 'authorized-example', 'pending');
  CREATE TYPE "public"."enum_news_kind" AS ENUM('news', 'event');
  CREATE TYPE "public"."enum_crop_guides_status" AS ENUM('draft', 'owner-review', 'approved', 'rejected');
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"country" varchar,
  	"phone" varchar,
  	"role" varchar,
  	"message" varchar NOT NULL,
  	"locale" "enum_inquiries_locale" DEFAULT 'en',
  	"source_path" varchar,
  	"consent" boolean DEFAULT false NOT NULL,
  	"status" "enum_inquiries_status" DEFAULT 'new',
  	"owner_note" varchar,
  	"website" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_source_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page" numeric NOT NULL
  );
  
  CREATE TABLE "products_source_related_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page" numeric NOT NULL,
  	"role" "enum_products_source_related_pages_role" NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "insights_topics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL
  );
  
  CREATE TABLE "crop_guides_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL
  );
  
  CREATE TABLE "crop_guides_sections_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "crop_guides" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_crop_guides_status" DEFAULT 'owner-review',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "crop_guides_locales" (
  	"nav" varchar NOT NULL,
  	"overview" varchar,
  	"stages" varchar,
  	"stages_text" varchar,
  	"nutrition" varchar,
  	"products" varchar,
  	"browse" varchar,
  	"resources" varchar,
  	"resources_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "products" ADD COLUMN "source_url" varchar;
  ALTER TABLE "products" ADD COLUMN "source_preview_path" varchar;
  ALTER TABLE "products" ADD COLUMN "source_detail_preview_path" varchar;
  ALTER TABLE "products" ADD COLUMN "source_note" varchar;
  ALTER TABLE "products" ADD COLUMN "review_status" "enum_products_review_status" DEFAULT 'owner-review';
  ALTER TABLE "products" ADD COLUMN "asset_status" "enum_products_asset_status" DEFAULT 'generated-placeholder';
  ALTER TABLE "products" ADD COLUMN "claims_verified" boolean DEFAULT false;
  ALTER TABLE "news" ADD COLUMN "kind" "enum_news_kind" DEFAULT 'news';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "inquiries_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "crop_guides_id" integer;
  ALTER TABLE "products_source_pages" ADD CONSTRAINT "products_source_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_source_related_pages" ADD CONSTRAINT "products_source_related_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insights_topics" ADD CONSTRAINT "insights_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "crop_guides_sections" ADD CONSTRAINT "crop_guides_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."crop_guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "crop_guides_sections_locales" ADD CONSTRAINT "crop_guides_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."crop_guides_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "crop_guides_locales" ADD CONSTRAINT "crop_guides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."crop_guides"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "products_source_pages_order_idx" ON "products_source_pages" USING btree ("_order");
  CREATE INDEX "products_source_pages_parent_id_idx" ON "products_source_pages" USING btree ("_parent_id");
  CREATE INDEX "products_source_related_pages_order_idx" ON "products_source_related_pages" USING btree ("_order");
  CREATE INDEX "products_source_related_pages_parent_id_idx" ON "products_source_related_pages" USING btree ("_parent_id");
  CREATE INDEX "insights_topics_order_idx" ON "insights_topics" USING btree ("_order");
  CREATE INDEX "insights_topics_parent_id_idx" ON "insights_topics" USING btree ("_parent_id");
  CREATE INDEX "crop_guides_sections_order_idx" ON "crop_guides_sections" USING btree ("_order");
  CREATE INDEX "crop_guides_sections_parent_id_idx" ON "crop_guides_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "crop_guides_sections_locales_locale_parent_id_unique" ON "crop_guides_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "crop_guides_sections_locales_parent_id_idx" ON "crop_guides_sections_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "crop_guides_slug_idx" ON "crop_guides" USING btree ("slug");
  CREATE INDEX "crop_guides_updated_at_idx" ON "crop_guides" USING btree ("updated_at");
  CREATE INDEX "crop_guides_created_at_idx" ON "crop_guides" USING btree ("created_at");
  CREATE UNIQUE INDEX "crop_guides_locales_locale_parent_id_unique" ON "crop_guides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "crop_guides_locales_parent_id_idx" ON "crop_guides_locales" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_crop_guides_fk" FOREIGN KEY ("crop_guides_id") REFERENCES "public"."crop_guides"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_crop_guides_id_idx" ON "payload_locked_documents_rels" USING btree ("crop_guides_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "inquiries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_source_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_source_related_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "insights_topics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "crop_guides_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "crop_guides_sections_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "crop_guides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "crop_guides_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "products_source_pages" CASCADE;
  DROP TABLE "products_source_related_pages" CASCADE;
  DROP TABLE "insights_topics" CASCADE;
  DROP TABLE "crop_guides_sections" CASCADE;
  DROP TABLE "crop_guides_sections_locales" CASCADE;
  DROP TABLE "crop_guides" CASCADE;
  DROP TABLE "crop_guides_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_inquiries_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_crop_guides_fk";
  
  DROP INDEX "payload_locked_documents_rels_inquiries_id_idx";
  DROP INDEX "payload_locked_documents_rels_crop_guides_id_idx";
  ALTER TABLE "products" DROP COLUMN "source_url";
  ALTER TABLE "products" DROP COLUMN "source_preview_path";
  ALTER TABLE "products" DROP COLUMN "source_detail_preview_path";
  ALTER TABLE "products" DROP COLUMN "source_note";
  ALTER TABLE "products" DROP COLUMN "review_status";
  ALTER TABLE "products" DROP COLUMN "asset_status";
  ALTER TABLE "products" DROP COLUMN "claims_verified";
  ALTER TABLE "news" DROP COLUMN "kind";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "inquiries_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "crop_guides_id";
  DROP TYPE "public"."enum_inquiries_locale";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_products_source_related_pages_role";
  DROP TYPE "public"."enum_products_review_status";
  DROP TYPE "public"."enum_products_asset_status";
  DROP TYPE "public"."enum_news_kind";
  DROP TYPE "public"."enum_crop_guides_status";`)
}
