import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "company_profile" ADD COLUMN "email" varchar;
  ALTER TABLE "company_profile" ADD COLUMN "whatsapp" varchar;
  ALTER TABLE "company_profile_locales" ADD COLUMN "legal_name" varchar;
  ALTER TABLE "company_profile_locales" ADD COLUMN "address" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "company_profile" DROP COLUMN "email";
  ALTER TABLE "company_profile" DROP COLUMN "whatsapp";
  ALTER TABLE "company_profile_locales" DROP COLUMN "legal_name";
  ALTER TABLE "company_profile_locales" DROP COLUMN "address";`)
}
