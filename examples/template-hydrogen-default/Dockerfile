FROM node:14 AS build-env
ADD . /app

WORKDIR /app
RUN npm install
RUN npm run build

FROM gcr.io/distroless/nodejs:14 AS run-env
ENV NODE_ENV production
COPY --from=build-env /app /app

EXPOSE 8080

WORKDIR /app
CMD ["server.js"]
