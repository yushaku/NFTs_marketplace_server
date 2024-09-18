build:
	docker build -t "nestjs-starter:prod" -f Dockerfile.prod .

run:
	docker run --rm -p 8000:8000 --name nestjs-starter nestjs-starter:prod

env:
	bin/generate-env.sh 
