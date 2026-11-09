import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "company_profile" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "company_profile_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "company_profile_locales" ADD CONSTRAINT "company_profile_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_profile"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "company_profile_locales_locale_parent_id_unique" ON "company_profile_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "company_profile_locales_parent_id_idx" ON "company_profile_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "company_profile_locales";
  DROP TABLE "company_profile";`)
}
