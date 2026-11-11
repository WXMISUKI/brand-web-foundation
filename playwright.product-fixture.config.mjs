import { defineConfig } from 'playwright/test';
export default defineConfig({ testDir:'./tests', testMatch:['product-content-payload.spec.mjs'], workers:1, reporter:'list' });
