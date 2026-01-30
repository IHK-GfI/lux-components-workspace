FROM node:22 as node
LABEL MAINTAINER thomas.dickhut@gfi.ihk.de

USER root
RUN npm install -g @angular/cli@19

WORKDIR /tmp
COPY . .

USER $USERNAME

SHELL ["/bin/bash", "-c"]
RUN npm pkg delete scripts.prepare && \
    npm install && \
    npm run pack:demo && \
    npm run util:move-de-files && \
    cd dist && \
    cd demo-app && \
    ls -a && \
    cd ..

FROM nginx:stable-alpine3.23-slim
LABEL MAINTAINER thomas.dickhut@gfi.ihk.de
EXPOSE 8080

USER root

RUN mkdir -p /run/nginx && mkdir -p /var/www/html
COPY nginx.conf /etc/nginx/
COPY --from=node /tmp/dist/demo-app /var/www/html

RUN find /var/www/html/ -type f -regex ".*\.\(html\|js\|css\)" -exec sh -c "gzip < {} > {}.gz" \;
RUN chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /var/www/ && \
    chown -R nginx:nginx /run && \
    ls -al /var/www/* -R && \
    cat /etc/nginx/nginx.conf

USER $USERNAME
ENV HOME=/var/www/
WORKDIR $HOME
CMD ["sh", "-c", "exec nginx -g 'daemon off; '"]