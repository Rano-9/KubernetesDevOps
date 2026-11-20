# ---- Stage 1: Build ----
FROM oven/bun:alpine AS build

WORKDIR /app

COPY todo-frontend/package*.json ./
RUN bun install

COPY todo-frontend/ .

RUN bun run build

# ---- Stage 2: Serve ----
FROM node:alpine

WORKDIR /app

ENV PORT=3000

RUN addgroup -S -g 1001 appgroup \
    && adduser -S -u 1001 appuser -G appgroup \
    && npm install -g serve

COPY --from=build --chown=appuser:appgroup /app/dist ./dist

USER appuser

EXPOSE 3000

CMD ["sh", "-c", "serve -s dist -l ${PORT}"]
