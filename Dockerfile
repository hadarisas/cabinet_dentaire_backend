FROM postgres:latest

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=cabinet_db

EXPOSE 5432

VOLUME /var/lib/postgresql/data
