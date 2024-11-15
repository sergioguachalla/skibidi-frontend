FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY ./dist/skibidi-frontend/browser /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
