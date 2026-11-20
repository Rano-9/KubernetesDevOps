FROM python:alpine

ENV PORT=8888

WORKDIR /app
COPY todo-app/ ./todo-app
COPY requirements.txt entrypoint.sh ./

RUN mkdir /share \
    && pip install -r requirements.txt \
    && addgroup -S -g 1001 appgroup \
    && adduser -S -u 1001 appuser -G appgroup \
    && chown -R appuser:appgroup /app \
    && chown -R appuser:appgroup /share \
    && chmod +x /app/entrypoint.sh

USER appuser

ENTRYPOINT ["/app/entrypoint.sh"]