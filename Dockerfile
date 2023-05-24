FROM nginx:alpine
ADD react_site.conf /etc/nginx/conf.d/
WORKDIR /usr/share/nginx/html
COPY build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]