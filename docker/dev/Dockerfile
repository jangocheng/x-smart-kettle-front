FROM nginx:1.13.12
#维护者信息
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./redirect.html /opt/apps/htdocs/index.html
COPY ./dist /apps/idmp-manage
EXPOSE 80
#指定挂载点
VOLUME ["/var/log/nginx"]

