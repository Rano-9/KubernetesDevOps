FROM python:alpine

ENV PORT=8080

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt \
    && addgroup -S appgroup \
    && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app

USER appuser

ENTRYPOINT [ "python","app.py" ]