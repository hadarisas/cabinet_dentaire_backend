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
cp example_env.txt .env
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
npx prisma studio
```

## Create a self-signed certificate for https

### For MacOS:

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install mkcert
brew install mkcert

# Install nss (for Firefox)
brew install nss

# Create and install the local CA
mkcert -install

# Create certificates for localhost
mkcert localhost 127.0.0.1 ::1
```

### For Windows:

```bash
# Using chocolatey
choco install mkcert

# Or using scoop
scoop bucket add extras
scoop install mkcert
```

### For Linux:

```bash
# Ubuntu/Debian
sudo apt install libnss3-tools
sudo apt install mkcert

# Or download the binary directly
curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
chmod +x mkcert-v*-linux-amd64
sudo cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert
```

### After that you can create the certificates with the following command:

```bash
# Create and install the local CA
mkcert -install

# Create certificates for localhost
mkcert localhost 127.0.0.1 ::1
```

### This will generate two files: localhost+2.pem (the certificate) and localhost+2-key.pem (the private key)

### Move these files to your project directory and update your

## run the project in development mode:

```bash
npm run dev
```

## For the API documentation, you can use the following link (if you use another port than 3000, replace it in the link):

```bash
http://localhost:3000/docs-api
```

### If you want to use the cookie instead of the token you need to comment

`router.use(authJwt.verifyToken);`

in the routes files and uncomment

`router.use(authJwt.authenticateToken);`

## The project is not finished yet, other features will be added in Coming days. so stay tuned!
