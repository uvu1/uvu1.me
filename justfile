# justfile

set dotenv-load

default:
    just --list

dev:
    bun run dev

build:
    bun run build

preview:
    bun run preview

test:
    bun run test

test-run:
    bun run test:run

lint:
    bun run lint

format:
    bun run format

check:
    bun run check

ci:
    bun run ci

deploy:
    bun run deploy

generate:
    bun run generate:contents

thumbs:
    bun run generate:thumbs

projects:
    bun run generate:projects

sitemap:
    bun run generate:sitemap

robots:
    bun run generate:robots

rss:
    bun run generate:rss

favicons:
    bun run generate:favicons
