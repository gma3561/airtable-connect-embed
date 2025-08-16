#!/usr/bin/env sh

# 에러 발생시 중단
set -e

# 빌드
cd web
npm run build

# 빌드된 파일로 이동
cd dist

# GitHub Pages 배포를 위한 설정
git init
git add -A
git commit -m 'deploy'

# GitHub Pages 브랜치로 푸시
git push -f https://github.com/gma3561/airtable-connect-embed.git main:gh-pages

cd -