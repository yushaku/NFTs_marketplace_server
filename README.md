# Description

<!--toc:start-->

- [Description](#description)
  - [Requirements](#requirements)
  - [Development](#development)
  - [Deploy](#deploy)

<!--toc:end-->

Project use [Nest](https://github.com/nestjs/nest) 10 framework TypeScript

## Requirements

- Docker and docker-compose are installed.
- NodeJS version 18 is installed.

## Development

Migrate database and running the app

```bash
cp .env.dev .env
docker-compose up
```

## test

```sh
# Empty GET
k6 run --vus 300 --iterations 100000 ./test/empty_get.js

# Get with no cache
k6 run --vus 300 --iterations 100000 ./test/1_get_no_cache.js

# Get with cache
k6 run --vus 300 --iterations 100000 ./test/2_get_with_cache.js

# Get with promise cache
k6 run --vus 300 --iterations 100000 ./test/3_get_with_Promise_cache.js
```

| test                        | https time | RPS          | min      | max      | p95      | cpu  |
| --------------------------- | ---------- | ------------ | -------- | -------- | -------- | ---- |
| get empty                   |            | 423 times/s  | 166.52µs | 44.96ms  | 2.97ms   | 113% |
| get post without cache      | 02m44.7s   | 607 times/s  | 205.35ms | 998.73ms | 704.71ms | 113% |
| get post with cache         | 01m06.5s   | 1108 times/s | 90.47ms  | 528.39ms | 322.14ms | 113% |
| get post with promise cache | 01m21.3s   | 1108 times/s | 84.53ms  | 558.49ms | 314.41ms | 113% |

## Deploy

```bash
cp .env.prod .env
yarn
yarn build
./run-prod.sh
```
