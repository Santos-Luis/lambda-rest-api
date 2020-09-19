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
* **/create**:
    * **HTTP Method:** 
        * POST
    * **Body:** 
        * **maker**: must be either - BMW, Renault, Toyota
        * **model**: for BMW must be either - Series3, X1 - for Renault must be either - Clio, Megane - for Toyota mus be either - Yaris, RAV4
        * **year**: must be between 1885 and the current year
        * **color**: must be a string
        * **monthly**: the subscription price: must be higher than 100, since we are using the last 2 digits as decimal
        * **availability**: when the entity is available for booking - must be a valid date
    * **Description:** 
        * Creates a new entity based on given parameters
    * **Return Values:**
        * entity id
    
       
* **/update/{id}**:
    * **HTTP Method:** 
        * PUT
    * **Body:** 
        * the same as `/create` but all are optional
        * any given parameters that's not on the list will be ignored
    * **Description:** 
        * Updates a entity with id `/{id}` based on given parameters
    * **Return Values:**
        * Entity id
       
        
* **/list**:
    * **HTTP Method:** 
        * GET
    * **Query Parameters** (all optional):
        * **lastItem**: the last item **id** from last search (pagination)
        * **sort** (always ascending): must be either: price, year, maker or availability
        * **maker**: filter the results by maker
        * **color**: filter the results by color
    * **Description:** 
        * List all the item based on the filters given/or not. If there's no filter passed, the results are the first 20 valid entities, available on the next three months, sorted by price.
    * **Return Values:**
        * list of entities

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
