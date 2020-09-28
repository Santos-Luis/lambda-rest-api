[![ci-tests Actions Status](https://github.com/Santos-Luis/lambda-rest-api/workflows/ci-tests/badge.svg)](https://github.com/Santos-Luis/lambda-rest-api/actions)

## Lambda Rest Api
The project consists on a nodejs lambda connected to API gateway and dynamodb, using serverless to deployment process

### Stack requirements
* [NodeJs & npm](https://nodejs.org/en/download/package-manager/)
* [Docker](https://docs.docker.com/get-docker/) (if you don't want to install JRE)
* [Aws cli](https://docs.aws.amazon.com/cli/latest/userguide/install-macos.html) (if you want to deploy the project to your aws account)


### Installation & development
* We use serverless offline and dynamodb local, so we can run the lambda in local environment.
* If you don't have JRE installed, we provide a docker to run the local environment. In the following steps it will be marked either `(docker)` or `(JRE)`, so ignore the ones you are not following

* **Install dependencies**
```bash
  npm install
```

* **Run on development mode (JRE)**
```bash
  npm run install-dynamodb-local
  npm start
```

* **Run on development mode (docker)**
```bash
  docker-compose up --build
```

* **Load fixtures (optional)**
```bash
  npm run migrations
```

* We also provide a simple [postman collection](src/offline/lambda-rest-api.postman_collection.json) that you can import, so it's easier to make the API requests


## Route details
![](/swagger/create-parameters.png)
![](/swagger/create-response.png)
![](/swagger/list-parameters.png)
![](/swagger/list-response.png)
![](/swagger/update-parameters.png)
![](/swagger/update-response.png)

### Models
![](/swagger/models.png)

### Test
* We are following the standard of writing tests in the same folder of the file itself.
This means if you are going to write a test for `entityCreate.js` you should create a file named `entityCreate.spec.js`.

* To run the all the tests:
```bash
  npm test
```

### Deploy
* We are using serverless to both deploy and define the aws resources. So you need a user/role that has permissions to:
  * create a S3 bucket to place the deployment files;
  * create a dynamodb bucket;
  * create a lambda and link it to cloudwatch;

* Since all the resources are defined in the `serverless.yml` you just need to run
```bash
  npm deploy
```
