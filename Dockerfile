FROM denoland/deno:alpine

RUN apk update && \
    apk add --no-cache

COPY src src/

RUN deno cache --unstable ./src/dep.ts

ENTRYPOINT [ "deno", "run", "--allow-env", "--allow-net", "--allow-read", "--allow-write", "--unstable",  "./src/index.ts" ]
