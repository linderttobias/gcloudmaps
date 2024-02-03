FROM python:3.11.1-alpine as base
FROM base as builder
RUN mkdir /install
WORKDIR /install
COPY requirements.txt /requirements.txt
RUN pip install --prefix="/install" -r /requirements.txt
FROM base
ENV PYTHONUNBUFFERED 1
COPY --from=builder /install /usr/local
COPY . /app
WORKDIR /app
CMD exec gunicorn --bind :3001 --workers 1 --threads 8 --log-level=info --timeout 0 app:app