import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "homepage_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"action_path" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "homepage_slides_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"action_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "homepage_slides" ADD CONSTRAINT "homepage_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_slides" ADD CONSTRAINT "homepage_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_slides_locales" ADD CONSTRAINT "homepage_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_slides"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "homepage_slides_order_idx" ON "homepage_slides" USING btree ("_order");
  CREATE INDEX "homepage_slides_parent_id_idx" ON "homepage_slides" USING btree ("_parent_id");
  CREATE INDEX "homepage_slides_image_idx" ON "homepage_slides" USING btree ("image_id");
  CREATE UNIQUE INDEX "homepage_slides_locales_locale_parent_id_unique" ON "homepage_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_slides_locales_parent_id_idx" ON "homepage_slides_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "homepage_slides_locales";
  DROP TABLE "homepage_slides";
  DROP TABLE "homepage";`)
}
