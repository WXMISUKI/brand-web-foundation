const { chromium } = require('playwright');
const data = require('../src/data/flbook-import.json');
const base = process.env.PUBLIC_BASE_URL?.replace(/\/$/, '');
if (!base) throw new Error('PUBLIC_BASE_URL is required');
const locales = ['en','zh','he','nl','fr','it','es','pt','el','ro','ru','th','tr'];
const forbidden = /画册|原官网|来源页|brochure|source[ -]page|owner.review|formal review|folleto|broşür|брошюр|folheto|brochura|broșur|φυλλαδί|חוברת|โบรชัวร์/i;
(async()=>{
 const browser=await chromium.launch({headless:true}); const page=await browser.newPage(); const errors=[]; let checked=0;
 for(const locale of locales){
  for(const p of data.products){
   const path=`/${locale}/products/${p.slug}`;
   try {
    const response=await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:30000});
    const heading=await page.locator('.detail-intro h1').innerText();
    const intro=await page.locator('.detail-intro .lead').innerText();
    const facts=await page.locator('.detail-facts').innerText();
    if(response.status()!==200 || !heading.trim() || forbidden.test(intro) || forbidden.test(facts)) errors.push({path,status:response.status(),reason:'status, heading or source wording'});
    checked++;
   } catch(e) {errors.push({path,reason:e.name});}
  }
 }
 const fr=await page.goto(base+'/fr/products/official-569683',{waitUntil:'domcontentloaded'});
 const title=await page.locator('main h1').innerText();
 if(fr.status()!==200 || !title.includes('Engrais composé 15-5-20'))errors.push({path:'/fr/products/official-569683',reason:'localized name'});
 await browser.close();
 console.log(JSON.stringify({checked,errors},null,2));
 if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e.name);process.exitCode=1});
