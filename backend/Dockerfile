FROM node:18-alpine

WORKDIR /app/backend
COPY . .

RUN npm install

HEALTHCHECK CMD ["nc", "-z", "emqx1", "1883"]

CMD ["npm", "run", "production"]
