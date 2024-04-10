FROM nginx:1.25.4-alpine as host
WORKDIR /var/www/certbot
EXPOSE 80
COPY nginx.conf /etc/nginx/conf.d/default.conf

FROM certbot/certbot as certbot
RUN certonly --webroot -w /var/www/certbot/ --email uvuv.space@gmail.com -d api.uvuv643.ru -d uvuv643.ru --agree-tos --cert-name tourism
