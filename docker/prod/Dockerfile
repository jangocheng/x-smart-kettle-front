FROM nginx:1.17
#维护者信息
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./redirect.html /opt/apps/htdocs/index.html
COPY ./dist /apps/idmp-manage
VOLUME ["/var/log/nginx"]

