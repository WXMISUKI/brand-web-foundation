import config from "@payload-config";
import { REST_GET, REST_POST, REST_PATCH, REST_DELETE } from "@payloadcms/next/routes";
import { handleInquiryPost } from "../../../../lib/inquiry-endpoint";
export const GET = REST_GET(config);
const restPost = REST_POST(config);
export async function POST(request: Request, context: { params: Promise<{ slug: string[] }> }) {
  const params = await context.params;
  if (params.slug?.join("/") === "inquiries") return handleInquiryPost(request);
  return restPost(request, context);
}
export const PATCH = REST_PATCH(config);
export const DELETE = REST_DELETE(config);
