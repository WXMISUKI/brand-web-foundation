import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "insights" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"published_on" timestamp(3) with time zone,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "insights_locales" (
  	"title" varchar NOT NULL,
  	"summary" varchar,
  	"body" varchar,
  	"author" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "insights_id" integer;
  ALTER TABLE "insights" ADD CONSTRAINT "insights_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "insights_locales" ADD CONSTRAINT "insights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "insights_slug_idx" ON "insights" USING btree ("slug");
  CREATE INDEX "insights_image_idx" ON "insights" USING btree ("image_id");
  CREATE INDEX "insights_updated_at_idx" ON "insights" USING btree ("updated_at");
  CREATE INDEX "insights_created_at_idx" ON "insights" USING btree ("created_at");
  CREATE UNIQUE INDEX "insights_locales_locale_parent_id_unique" ON "insights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "insights_locales_parent_id_idx" ON "insights_locales" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_insights_id_idx" ON "payload_locked_documents_rels" USING btree ("insights_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "insights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "insights_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "insights" CASCADE;
  DROP TABLE "insights_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_insights_fk";
  
  DROP INDEX "payload_locked_documents_rels_insights_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "insights_id";`)
}
