export type SiteContact = {
  companyName: { en: string; zh: string };
  email: string;
  whatsapp: string;
  whatsappHref: string;
  address: string | null;
};

/**
 * Owner supplied contact details for the prototype.
 * Keep this fallback in one place so sample mode and Payload mode render the same contact surface.
 */
export const siteContact: SiteContact = {
  companyName: {
    en: "Anhui Kangmu International Fertilizer Co., Ltd.",
    zh: "安徽康母国际化肥股份有限公司",
  },
  email: "leon@kowloonglobaltrading.com",
  whatsapp: "+852 9074 0009",
  whatsappHref: "https://wa.me/85290740009",
  address: null,
};
