FROM node:16 AS build-env
ADD . /app

WORKDIR /app
RUN yarn
RUN yarn build

FROM gcr.io/distroless/nodejs:16 AS run-env
ENV NODE_ENV production
COPY --from=build-env /app /app

EXPOSE ${PORT:-8080}

WORKDIR /app
CMD ["server.js"]
