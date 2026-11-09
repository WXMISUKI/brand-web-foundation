import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "company_profile_focus_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "company_profile_focus_areas_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "company_profile_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"period" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "company_profile_milestones_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "company_profile_focus_areas" ADD CONSTRAINT "company_profile_focus_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_profile_focus_areas_locales" ADD CONSTRAINT "company_profile_focus_areas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_profile_focus_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_profile_milestones" ADD CONSTRAINT "company_profile_milestones_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "company_profile_milestones" ADD CONSTRAINT "company_profile_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_profile_milestones_locales" ADD CONSTRAINT "company_profile_milestones_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_profile_milestones"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "company_profile_focus_areas_order_idx" ON "company_profile_focus_areas" USING btree ("_order");
  CREATE INDEX "company_profile_focus_areas_parent_id_idx" ON "company_profile_focus_areas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "company_profile_focus_areas_locales_locale_parent_id_unique" ON "company_profile_focus_areas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "company_profile_focus_areas_locales_parent_id_idx" ON "company_profile_focus_areas_locales" USING btree ("_parent_id");
  CREATE INDEX "company_profile_milestones_order_idx" ON "company_profile_milestones" USING btree ("_order");
  CREATE INDEX "company_profile_milestones_parent_id_idx" ON "company_profile_milestones" USING btree ("_parent_id");
  CREATE INDEX "company_profile_milestones_image_idx" ON "company_profile_milestones" USING btree ("image_id");
  CREATE UNIQUE INDEX "company_profile_milestones_locales_locale_parent_id_unique" ON "company_profile_milestones_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "company_profile_milestones_locales_parent_id_idx" ON "company_profile_milestones_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "company_profile_focus_areas" CASCADE;
  DROP TABLE "company_profile_focus_areas_locales" CASCADE;
  DROP TABLE "company_profile_milestones" CASCADE;
  DROP TABLE "company_profile_milestones_locales" CASCADE;`)
}
