# Backend for a 'Cabinet dentaire' project

This the backend part of the 'Cabinet dentaire' project, Built using express js and prisma and postgres.

## Git clone this repository

```bash
git clone git@github.com:hadarisas/cabinet_dentaire_backend.git
```

## Access to repository folder

```bash
cd cabinet_dentaire_backend
```

## install packages

```bash
npm i
```

## install nodemon to run development mode

```bash
npm i -g nodemon
```

## Create an image for Postgres database using docker

```bash
docker build -t postgres_db_cabinet .
```

## Create a folder for Postgres database data:

```bash
mkdir postgres_db_data
```

## Run the image in the container

```bash
docker run -d --name cabinet_db_container -v /absolute_path_to_postgres_db_data:/var/lib/postgresql/data -p 5432:5432 postgres_db_cabinet
```

## Create a .env file and add the environment variables

```bash
cp example_env .env
```

## Push the database schema to the database

```bash
npx prisma db push
```

## Seed the database

```bash
npm run seed
```

## To Run the prisma studio to see the database data

```bash
npm run studio
```

## run the project in development mode:

```bash
npm run dev
```

## The project is not finished yet, other features will be added in AS SOON AS POSSIBLE.
