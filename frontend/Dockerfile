# Usamos Nginx para servir los archivos estáticos
FROM nginx:alpine

# Copiamos el contenido de la carpeta local al directorio de Nginx
COPY . /usr/share/nginx/html/

# Exponemos el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]