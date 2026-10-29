FROM node:14-alpine AS build
WORKDIR /usr/src/app
RUN npm install --global npm@9
COPY package.json package-lock.json ./
RUN npm ci --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000
COPY zxing-scanner.component.d.ts /usr/src/app/node_modules/@zxing/ngx-scanner/lib/zxing-scanner.component.d.ts
COPY . .
RUN npx ng build --configuration production

# ### STAGE 2: ###
FROM nginx:1.17.1-alpine
RUN apk add --no-cache gettext
RUN mkdir -p /etc/nginx/certs
COPY nginx.conf /etc/nginx/conf.d/nginx.conf
COPY --from=build /usr/src/app/www/ /usr/share/nginx/html/
COPY docker/env.js.template /etc/frontend/env.js.template
COPY docker/entrypoint.sh /usr/local/bin/frontend-entrypoint.sh
RUN chmod +x /usr/local/bin/frontend-entrypoint.sh
ENTRYPOINT ["/usr/local/bin/frontend-entrypoint.sh"]
EXPOSE 80 443
