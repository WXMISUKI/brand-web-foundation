import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "company_profile" ADD COLUMN "banner_id" integer;
  ALTER TABLE "company_profile" ADD CONSTRAINT "company_profile_banner_id_media_id_fk" FOREIGN KEY ("banner_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "company_profile_banner_idx" ON "company_profile" USING btree ("banner_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "company_profile" DROP CONSTRAINT "company_profile_banner_id_media_id_fk";
  
  DROP INDEX "company_profile_banner_idx";
  ALTER TABLE "company_profile" DROP COLUMN "banner_id";`)
}
