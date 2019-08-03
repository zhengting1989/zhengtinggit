FROM nginx:1.13-alpine

MAINTAINER build@mojinshi.com

ARG suffix=""

WORKDIR /var/www

# change apk repositories to aliyun
COPY ./docker/repositories /etc/apk/repositories

# prepare env
RUN apk update
RUN apk add nodejs

# copy NPM repository settings
COPY ./tmp/.npmrc /root/.npmrc

# install site
RUN npm install hileveps-web${suffix} --registry=http://47.105.153.253:9998/repository/npm-private/
RUN cp -R /var/www/node_modules/hileveps-web${suffix} /var/www/node_modules/hilevepsweb
RUN rm -rf /var/www/node_modules/hileveps-web${suffix}

# add site as default of nginx
COPY ./docker/nginx-server /etc/nginx/conf.d/default.conf
