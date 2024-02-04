FROM python:3.11.1-alpine as base

FROM base as builder
RUN mkdir /install
WORKDIR /install
COPY requirements.txt /requirements.txt
RUN pip install --prefix="/install" -r /requirements.txt

FROM gcr.io/distroless/python3

ENV PYTHONUNBUFFERED 1
COPY --from=builder /install /usr/local
COPY . /app
WORKDIR /app
CMD ["wsgi.py"]