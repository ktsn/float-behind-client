#!/bin/bash
set -e

ROOT_DIR=$(cd $(dirname $0); cd ..; pwd)

npm run build
rsync -a --delete $ROOT_DIR/dist/ $ROOT_DIR/osx/www/
