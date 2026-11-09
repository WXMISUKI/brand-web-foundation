FROM node:24.22.1-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PAYLOAD_DATABASE=postgres
ENV DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build
ENV PAYLOAD_SECRET=build-only-secret-32-characters-minimum
ENV PAYLOAD_MEDIA_DIR=/app/data/media
ENV CATALOG_SOURCE=sample
ENV CROP_GUIDE_SOURCE=sample
RUN npm run build

FROM node:24.22.1-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PAYLOAD_DATABASE=postgres
ENV PAYLOAD_MEDIA_DIR=/app/data/media
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
RUN mkdir -p /app/data/media
EXPOSE 3000
CMD ["node", "server.js"]
