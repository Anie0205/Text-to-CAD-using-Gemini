FROM ubuntu:20.04

RUN apt-get update && \
    apt-get install -y openscad python3 python3-pip && \
    apt-get clean

WORKDIR /app

COPY . .

RUN pip3 install -r requirements.txt

EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
