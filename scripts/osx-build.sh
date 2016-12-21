#!/bin/bash
set -e

ROOT_DIR=$(cd $(dirname $0); cd ..; pwd)

NODE_ENV=production $ROOT_DIR/scripts/osx-www.sh

xcodebuild build \
  -configuration "Release" \
  -scheme FloatBehindProduction \
  -workspace ${ROOT_DIR}/osx/FloatBehind.xcworkspace \
  CONFIGURATION_BUILD_DIR="${ROOT_DIR}/osx/build/"

open "${ROOT_DIR}/osx/build/FloatBehind.app"
