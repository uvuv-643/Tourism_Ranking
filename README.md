# Поиск туристических мест Росии

## Деплоймент

Для корректной работы обязательно наличие домена для API
и основного сайта с указанием DNS записей для текущего сервера.
Указать домен можно в docker-compose сервисе `certbot`.

```shell
sudo chmod 777 init.sh
./init.sh
cp .env.example .env
cp fastapi/.env.example fastapi/.env
docker-compose up -d
```