import { getPayload } from "payload";
import config from "@payload-config";

/** Share one Payload client per server process so concurrent cold-start requests do not race initialization. */
let payloadPromise: ReturnType<typeof getPayload> | null = null;

export function getAppPayload() {
  payloadPromise ??= getPayload({ config });
  return payloadPromise;
}
