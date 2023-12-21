# Recepku-API
Recepku-API project is part of the Recepku application. This is an API build with the Express.js as app application framework, Sequelize as ORM, and node-nlp as a BOT mockup.

## Features
* Build with Express Js
* API documentations with Postman
* Bearer authentication
* In-Memory Cache with Memcached

## Project structure 
* **config**
  * **dbConfig.js**
  * **imgUpload.js**
* **route**
  * **auth.js**
  * **makanan.js**
  * **profile.js**
* .env (environment file)

## Library
* Google Cloud / Debug Agent
* Google Cloud / Storage
* Bcrypt js
* Body Parser
* Cookie Parse
* Cors
* Dateformat
* Express
* Express Session
* Firebase Admin
* Json Web Token
* Multer
* Nodemon
* uuid

## Installation
### Pull image from Docker HUB
  ```
  $ docker pull c2159f1689/c22-ps234-cc-api
  ```
run container, dont forget to change environment, MIGRATE=1 (optional it's for database migration), example :
  ```
  $ docker run -d --name cc-api -e NODE_ENV=production -e MIGRATE=1 -e HOST=0.0.0.0 -e PORT=5000 -e DB_HOST=172.17.0.7 -e DB_USERNAME=username -e DB_PASSWORD=secretpass -e DB_DATABASE=my_db -e DB_DIALECT=postgres -e MEMCACHIER_SERVERS=172.17.0.8 -e ACCESS_TOKEN_AGE=900 -e ACCESS_TOKEN_KEY=nmcd8sajdsa8 -e REFRESH_TOKEN_KEY=mcd9aidmacid -e ML_API=http://ml-api.com -p 5000:5000 c22-ps234-cc-api:latest
  ```
### Build from Dockerfile
1) Clone this repo
  ```
  $ git clone https://github.com/Ian-72/Recepku-API.git
  ```

2) Go to Recepku-API directory
  ```
  $ cd Recepku-API
  ```

3) Build docker image
  ```
  $ docker build -t c22-ps234-cc-api:latest .
  ```

5) run container, dont forget to change environment, MIGRATE=1 (optional it's for database migration), example
  ```
  $ docker run -d --name cc-api -e NODE_ENV=production -e MIGRATE=1 -e HOST=0.0.0.0 -e PORT=5000 -e DB_HOST=172.17.0.7 -e DB_USERNAME=username -e DB_PASSWORD=secretpass -e DB_DATABASE=my_db -e DB_DIALECT=postgres -e MEMCACHIER_SERVERS=172.17.0.8 -e ACCESS_TOKEN_AGE=900 -e ACCESS_TOKEN_KEY=nmcd8sajdsa8 -e REFRESH_TOKEN_KEY=mcd9aidmacid -e ML_API=http://ml-api.com -p 5000:5000 c22-ps234-cc-api:latest
  ```

6) View the API documentation in GDocs at (https://backend-dot-capstone-bangkit01.et.r.appspot.com)
