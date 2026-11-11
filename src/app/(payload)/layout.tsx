import config from "@payload-config";
import "@payloadcms/next/css";
import "./admin-locale.css";
import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import { importMap } from "./admin/importMap.js";
import type { ReactNode } from "react";

const serverFunction: ServerFunctionClient = async (args) => { "use server"; return handleServerFunctions({ ...args, config, importMap }); };
export default function PayloadLayout({ children }: { children: ReactNode }) { return <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>{children}</RootLayout>; }
