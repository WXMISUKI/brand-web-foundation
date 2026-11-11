import candidates from "./official-site-product-candidates.json" with { type: "json" };
import type { LocaleCode } from "../i18n/locales.ts";

// Category translations follow the existing source names; no application claims are added.
const labels: Partial<Record<LocaleCode, readonly string[]>> = {
  he: ["חלבון דגים","פפטידי דגים, סידן ומגנזיום","דשן אורגני מסיס עם פפטידים","דשן מסיס עם יסודות ראשיים","דשן מסיס עם פוספיט אשלגן","דשן מסיס עם זרחן, סידן ואבץ","דשן מסיס עם סידן, מגנזיום, בור ואבץ","דשן מסיס עם סידן, מגנזיום וסיליקון","דשן מורכב","דשן מורכב עם אשלגן חנקתי","דשן אורגני עם חומצה הומית","דשן מיקרוביאלי מורכב","דשן גרגירי מסיס"],
  nl: ["Viseiwit","Vispeptiden met calcium en magnesium","Organische wateroplosbare meststof met peptiden","Wateroplosbare meststof met hoofdelementen","Wateroplosbare meststof met kaliumfosfiet","Wateroplosbare meststof met fosfor, calcium en zink","Wateroplosbare meststof met calcium, magnesium, boor en zink","Wateroplosbare meststof met calcium, magnesium en silicium","Samengestelde meststof","Samengestelde meststof met kaliumnitraat","Organische meststof met humuszuur","Samengestelde microbiële meststof","Korrelvormige wateroplosbare meststof"],
  fr: ["Protéines de poisson","Peptides de poisson, calcium et magnésium","Engrais organique hydrosoluble aux peptides","Engrais hydrosoluble à éléments majeurs","Engrais hydrosoluble au phosphite de potassium","Engrais hydrosoluble au phosphore, calcium et zinc","Engrais hydrosoluble au calcium, magnésium, bore et zinc","Engrais hydrosoluble au calcium, magnésium et silicium","Engrais composé","Engrais composé au nitrate de potassium","Engrais organique à l’acide humique","Engrais microbien composé","Engrais hydrosoluble granulé"],
  it: ["Proteine di pesce","Peptidi di pesce, calcio e magnesio","Fertilizzante organico idrosolubile con peptidi","Fertilizzante idrosolubile a elementi principali","Fertilizzante idrosolubile al fosfito di potassio","Fertilizzante idrosolubile con fosforo, calcio e zinco","Fertilizzante idrosolubile con calcio, magnesio, boro e zinco","Fertilizzante idrosolubile con calcio, magnesio e silicio","Fertilizzante composto","Fertilizzante composto al nitrato di potassio","Fertilizzante organico con acido umico","Fertilizzante microbico composto","Fertilizzante idrosolubile granulare"],
  es: ["Proteína de pescado","Péptidos de pescado, calcio y magnesio","Fertilizante orgánico hidrosoluble con péptidos","Fertilizante hidrosoluble de elementos principales","Fertilizante hidrosoluble con fosfito de potasio","Fertilizante hidrosoluble con fósforo, calcio y zinc","Fertilizante hidrosoluble con calcio, magnesio, boro y zinc","Fertilizante hidrosoluble con calcio, magnesio y silicio","Fertilizante compuesto","Fertilizante compuesto con nitrato de potasio","Fertilizante orgánico con ácido húmico","Fertilizante microbiano compuesto","Fertilizante hidrosoluble granulado"],
  pt: ["Proteína de peixe","Péptidos de peixe, cálcio e magnésio","Fertilizante orgânico hidrossolúvel com péptidos","Fertilizante hidrossolúvel de elementos principais","Fertilizante hidrossolúvel com fosfito de potássio","Fertilizante hidrossolúvel com fósforo, cálcio e zinco","Fertilizante hidrossolúvel com cálcio, magnésio, boro e zinco","Fertilizante hidrossolúvel com cálcio, magnésio e silício","Fertilizante composto","Fertilizante composto com nitrato de potássio","Fertilizante orgânico com ácido húmico","Fertilizante microbiano composto","Fertilizante hidrossolúvel granulado"],
  el: ["Πρωτεΐνη ψαριού","Πεπτίδια ψαριού, ασβέστιο και μαγνήσιο","Οργανικό υδατοδιαλυτό λίπασμα με πεπτίδια","Υδατοδιαλυτό λίπασμα κύριων στοιχείων","Υδατοδιαλυτό λίπασμα με φωσφίτη καλίου","Υδατοδιαλυτό λίπασμα με φώσφορο, ασβέστιο και ψευδάργυρο","Υδατοδιαλυτό λίπασμα με ασβέστιο, μαγνήσιο, βόριο και ψευδάργυρο","Υδατοδιαλυτό λίπασμα με ασβέστιο, μαγνήσιο και πυρίτιο","Σύνθετο λίπασμα","Σύνθετο λίπασμα με νιτρικό κάλιο","Οργανικό λίπασμα με χουμικό οξύ","Σύνθετο μικροβιακό λίπασμα","Κοκκώδες υδατοδιαλυτό λίπασμα"],
  ro: ["Proteină de pește","Peptide de pește, calciu și magneziu","Îngrășământ organic hidrosolubil cu peptide","Îngrășământ hidrosolubil cu elemente principale","Îngrășământ hidrosolubil cu fosfit de potasiu","Îngrășământ hidrosolubil cu fosfor, calciu și zinc","Îngrășământ hidrosolubil cu calciu, magneziu, bor și zinc","Îngrășământ hidrosolubil cu calciu, magneziu și siliciu","Îngrășământ compus","Îngrășământ compus cu azotat de potasiu","Îngrășământ organic cu acid humic","Îngrășământ microbian compus","Îngrășământ hidrosolubil granulat"],
  ru: ["Рыбный белок","Рыбные пептиды, кальций и магний","Органическое водорастворимое удобрение с пептидами","Водорастворимое удобрение с основными элементами","Водорастворимое удобрение с фосфитом калия","Водорастворимое удобрение с фосфором, кальцием и цинком","Водорастворимое удобрение с кальцием, магнием, бором и цинком","Водорастворимое удобрение с кальцием, магнием и кремнием","Комплексное удобрение","Комплексное удобрение с нитратом калия","Органическое удобрение с гуминовой кислотой","Комплексное микробное удобрение","Гранулированное водорастворимое удобрение"],
  th: ["โปรตีนปลา","เปปไทด์ปลา แคลเซียมและแมกนีเซียม","ปุ๋ยอินทรีย์ละลายน้ำผสมเปปไทด์","ปุ๋ยธาตุอาหารหลักละลายน้ำ","ปุ๋ยละลายน้ำผสมโพแทสเซียมฟอสไฟต์","ปุ๋ยละลายน้ำผสมฟอสฟอรัส แคลเซียมและสังกะสี","ปุ๋ยละลายน้ำผสมแคลเซียม แมกนีเซียม โบรอนและสังกะสี","ปุ๋ยละลายน้ำผสมแคลเซียม แมกนีเซียมและซิลิคอน","ปุ๋ยผสม","ปุ๋ยผสมโพแทสเซียมไนเตรต","ปุ๋ยอินทรีย์ผสมกรดฮิวมิก","ปุ๋ยจุลินทรีย์ผสม","ปุ๋ยเม็ดละลายน้ำ"],
  tr: ["Balık proteini","Balık peptitleri, kalsiyum ve magnezyum","Peptitli organik suda çözünür gübre","Ana elementli suda çözünür gübre","Potasyum fosfitli suda çözünür gübre","Fosfor, kalsiyum ve çinko içeren suda çözünür gübre","Kalsiyum, magnezyum, bor ve çinko içeren suda çözünür gübre","Kalsiyum, magnezyum ve silikon içeren suda çözünür gübre","Kompoze gübre","Potasyum nitratlı kompoze gübre","Hümik asitli organik gübre","Kompoze mikrobiyal gübre","Granül suda çözünür gübre"],
};
const typeById: Record<string, number> = {
  "754928":0,"754930":1,"754922":2,"754917":3,"754920":3,"754929":4,"754927":5,"754925":6,"754924":7,
  "569686":8,"569687":8,"569683":8,"569684":8,"569685":8,"569688":8,"569689":9,"569690":10,"569691":11,"569694":12,"569693":3,"569692":3,
};

const candidatesBySlug = new Map<string, (typeof candidates.products)[number]>(candidates.products.map(candidate => {
  const match = /\/(\d+)\.html$/.exec(candidate.sourceUrl);
  return [`official-${match?.[1] ?? ""}`, candidate] as const;
}));

/** Only replace an exact legacy generated name; retain individual editor changes. */
export function officialProductDisplayName(locale: LocaleCode, slug: string, value: string | null): string | null {
  const copy = labels[locale];
  const candidate = candidatesBySlug.get(slug);
  if (!copy || !candidate || value !== `KOMU product · ${candidate.name}`) return value;
  const id = slug.slice("official-".length);
  const type = copy[typeById[id]];
  if (!type) return value;
  const formula = candidate.name.match(/\d+(?:-\d+){2}(?:\+TE)?/)?.[0];
  return `KOMU · ${type}${formula ? ` ${formula}` : ""} · ${id}`;
}
