FROM python:alpine

ENV PORT=8888

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt \
    && addgroup -S appgroup \
    && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app

USER appuser
ENTRYPOINT ["sh", "-c", "gunicorn --workers 1 --capture-output --error-logfile - app:app --bind 0.0.0.0:$PORT" ]