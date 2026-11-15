FROM python:alpine

ENV PORT=8888

WORKDIR /app
COPY . .

RUN mkdir /share \
    && pip install -r requirements.txt \
    && addgroup -S -g 1001 appgroup \
    && adduser -S -u 1001 appuser -G appgroup \
    && chown -R appuser:appgroup /app \
    && chown -R appuser:appgroup /share

USER appuser
ENTRYPOINT ["sh", "-c", "gunicorn --workers 1 --capture-output --error-logfile - app:app --bind 0.0.0.0:$PORT" ]