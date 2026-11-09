import * as migration_20261105_124301_initial from './20261105_124301_initial.ts';
import * as migration_20261105_132204_add_insights from './20261105_132204_add_insights.ts';
import * as migration_20261105_152320_add_cases from './20261105_152320_add_cases.ts';
import * as migration_20261105_155348_add_faq from './20261105_155348_add_faq.ts';
import * as migration_20261105_162936_add_company_profile from './20261105_162936_add_company_profile.ts';
import * as migration_20261105_163855_add_company_banner from './20261105_163855_add_company_banner.ts';
import * as migration_20261105_165357_add_rich_body from './20261105_165357_add_rich_body.ts';
import * as migration_20261105_173034_add_homepage_slides from './20261105_173034_add_homepage_slides.ts';
import * as migration_20261105_174237_add_company_sections from './20261105_174237_add_company_sections.ts';
import * as migration_20261105_180211_add_homepage_featured from './20261105_180211_add_homepage_featured.ts';
import * as migration_20261108_005020_sync_current_schema from './20261108_005020_sync_current_schema.ts';
import * as migration_20261108_061401_add_company_contact_fields from './20261108_061401_add_company_contact_fields.ts';

export const migrations = [
  {
    up: migration_20261105_124301_initial.up,
    down: migration_20261105_124301_initial.down,
    name: '20261105_124301_initial',
  },
  {
    up: migration_20261105_132204_add_insights.up,
    down: migration_20261105_132204_add_insights.down,
    name: '20261105_132204_add_insights',
  },
  {
    up: migration_20261105_152320_add_cases.up,
    down: migration_20261105_152320_add_cases.down,
    name: '20261105_152320_add_cases',
  },
  {
    up: migration_20261105_155348_add_faq.up,
    down: migration_20261105_155348_add_faq.down,
    name: '20261105_155348_add_faq',
  },
  {
    up: migration_20261105_162936_add_company_profile.up,
    down: migration_20261105_162936_add_company_profile.down,
    name: '20261105_162936_add_company_profile',
  },
  {
    up: migration_20261105_163855_add_company_banner.up,
    down: migration_20261105_163855_add_company_banner.down,
    name: '20261105_163855_add_company_banner',
  },
  {
    up: migration_20261105_165357_add_rich_body.up,
    down: migration_20261105_165357_add_rich_body.down,
    name: '20261105_165357_add_rich_body',
  },
  {
    up: migration_20261105_173034_add_homepage_slides.up,
    down: migration_20261105_173034_add_homepage_slides.down,
    name: '20261105_173034_add_homepage_slides',
  },
  {
    up: migration_20261105_174237_add_company_sections.up,
    down: migration_20261105_174237_add_company_sections.down,
    name: '20261105_174237_add_company_sections',
  },
  {
    up: migration_20261105_180211_add_homepage_featured.up,
    down: migration_20261105_180211_add_homepage_featured.down,
    name: '20261105_180211_add_homepage_featured',
  },
  {
    up: migration_20261108_005020_sync_current_schema.up,
    down: migration_20261108_005020_sync_current_schema.down,
    name: '20261108_005020_sync_current_schema',
  },
  {
    up: migration_20261108_061401_add_company_contact_fields.up,
    down: migration_20261108_061401_add_company_contact_fields.down,
    name: '20261108_061401_add_company_contact_fields'
  },
];
