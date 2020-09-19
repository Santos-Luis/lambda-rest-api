FROM node:12-alpine
WORKDIR /app

COPY package.json package-lock.json serverless.yml ./
RUN npm install --ignore-scripts

COPY src src

EXPOSE 3000/tcp

ENTRYPOINT ["npm", "run", "docker-start"]
