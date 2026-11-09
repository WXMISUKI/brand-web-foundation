import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news_locales" ADD COLUMN "rich_body" jsonb;
  ALTER TABLE "insights_locales" ADD COLUMN "rich_body" jsonb;
  ALTER TABLE "cases_locales" ADD COLUMN "rich_body" jsonb;

  UPDATE "news_locales" SET "rich_body" = jsonb_build_object('root', jsonb_build_object('type', 'root', 'version', 1, 'direction', null, 'format', '', 'indent', 0, 'children', (SELECT jsonb_agg(jsonb_build_object('type', 'paragraph', 'version', 1, 'direction', null, 'format', '', 'indent', 0, 'textFormat', 0, 'textStyle', '', 'children', CASE WHEN line = '' THEN '[]'::jsonb ELSE jsonb_build_array(jsonb_build_object('type', 'text', 'version', 1, 'text', line, 'detail', 0, 'format', 0, 'mode', 'normal', 'style', '')) END) ORDER BY ord) FROM unnest(string_to_array(replace(replace("body", chr(13) || chr(10), chr(10)), chr(13), chr(10)), chr(10))) WITH ORDINALITY AS lines(line, ord)))) WHERE "body" IS NOT NULL AND "body" <> '';
  UPDATE "insights_locales" SET "rich_body" = jsonb_build_object('root', jsonb_build_object('type', 'root', 'version', 1, 'direction', null, 'format', '', 'indent', 0, 'children', (SELECT jsonb_agg(jsonb_build_object('type', 'paragraph', 'version', 1, 'direction', null, 'format', '', 'indent', 0, 'textFormat', 0, 'textStyle', '', 'children', CASE WHEN line = '' THEN '[]'::jsonb ELSE jsonb_build_array(jsonb_build_object('type', 'text', 'version', 1, 'text', line, 'detail', 0, 'format', 0, 'mode', 'normal', 'style', '')) END) ORDER BY ord) FROM unnest(string_to_array(replace(replace("body", chr(13) || chr(10), chr(10)), chr(13), chr(10)), chr(10))) WITH ORDINALITY AS lines(line, ord)))) WHERE "body" IS NOT NULL AND "body" <> '';
  UPDATE "cases_locales" SET "rich_body" = jsonb_build_object('root', jsonb_build_object('type', 'root', 'version', 1, 'direction', null, 'format', '', 'indent', 0, 'children', (SELECT jsonb_agg(jsonb_build_object('type', 'paragraph', 'version', 1, 'direction', null, 'format', '', 'indent', 0, 'textFormat', 0, 'textStyle', '', 'children', CASE WHEN line = '' THEN '[]'::jsonb ELSE jsonb_build_array(jsonb_build_object('type', 'text', 'version', 1, 'text', line, 'detail', 0, 'format', 0, 'mode', 'normal', 'style', '')) END) ORDER BY ord) FROM unnest(string_to_array(replace(replace("body", chr(13) || chr(10), chr(10)), chr(13), chr(10)), chr(10))) WITH ORDINALITY AS lines(line, ord)))) WHERE "body" IS NOT NULL AND "body" <> '';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news_locales" DROP COLUMN "rich_body";
  ALTER TABLE "insights_locales" DROP COLUMN "rich_body";
  ALTER TABLE "cases_locales" DROP COLUMN "rich_body";`)
}
