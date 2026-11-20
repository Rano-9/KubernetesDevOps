FROM oven/bun:alpine AS builder
WORKDIR /app
COPY package*.json src/pong.ts ./

RUN bun install
RUN bun build --compile  pong.ts --outfile=server

FROM alpine:latest

WORKDIR /app

RUN apk add --no-cache libstdc++

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder --chown=appuser:appgroup /app/server .

USER appuser

ENTRYPOINT  ["./server"]
