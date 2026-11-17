#!/bin/sh
set -eu

: "${BACKEND_URL:?Set BACKEND_URL in the frontend service environment}"
: "${UPLOAD_URL:?Set UPLOAD_URL in the frontend service environment}"
: "${DOWNLOAD_URL:?Set DOWNLOAD_URL in the frontend service environment}"
: "${WEBDAV_URL:?Set WEBDAV_URL in the frontend service environment}"

envsubst '${BACKEND_URL} ${UPLOAD_URL} ${DOWNLOAD_URL} ${WEBDAV_URL}' \
  < /etc/frontend/env.js.template \
  > /usr/share/nginx/html/assets/env.js

exec nginx -g 'daemon off;'