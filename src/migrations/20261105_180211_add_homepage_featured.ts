import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "homepage_featured" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"action_path" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "homepage_featured_locales" (
  	"title" varchar,
  	"description" varchar,
  	"action_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "homepage_featured" ADD CONSTRAINT "homepage_featured_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_featured" ADD CONSTRAINT "homepage_featured_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_featured_locales" ADD CONSTRAINT "homepage_featured_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_featured"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "homepage_featured_order_idx" ON "homepage_featured" USING btree ("_order");
  CREATE INDEX "homepage_featured_parent_id_idx" ON "homepage_featured" USING btree ("_parent_id");
  CREATE INDEX "homepage_featured_image_idx" ON "homepage_featured" USING btree ("image_id");
  CREATE UNIQUE INDEX "homepage_featured_locales_locale_parent_id_unique" ON "homepage_featured_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_featured_locales_parent_id_idx" ON "homepage_featured_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "homepage_featured" CASCADE;
  DROP TABLE "homepage_featured_locales" CASCADE;`)
}
