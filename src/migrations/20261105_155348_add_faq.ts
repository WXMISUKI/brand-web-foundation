import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "faq_groups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faq_groups_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"group_id" integer NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faq_groups_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faqs_id" integer;
  ALTER TABLE "faq_groups_locales" ADD CONSTRAINT "faq_groups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_group_id_faq_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."faq_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "faq_groups_slug_idx" ON "faq_groups" USING btree ("slug");
  CREATE INDEX "faq_groups_updated_at_idx" ON "faq_groups" USING btree ("updated_at");
  CREATE INDEX "faq_groups_created_at_idx" ON "faq_groups" USING btree ("created_at");
  CREATE UNIQUE INDEX "faq_groups_locales_locale_parent_id_unique" ON "faq_groups_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faq_groups_locales_parent_id_idx" ON "faq_groups_locales" USING btree ("_parent_id");
  CREATE INDEX "faqs_group_idx" ON "faqs" USING btree ("group_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faqs_locales_parent_id_idx" ON "faqs_locales" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_groups_fk" FOREIGN KEY ("faq_groups_id") REFERENCES "public"."faq_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_faq_groups_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_groups_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faq_groups_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faqs_fk";
  DROP INDEX "payload_locked_documents_rels_faq_groups_id_idx";
  DROP INDEX "payload_locked_documents_rels_faqs_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faq_groups_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faqs_id";
  DROP TABLE "faqs_locales";
  DROP TABLE "faqs";
  DROP TABLE "faq_groups_locales";
  DROP TABLE "faq_groups";`)
}
