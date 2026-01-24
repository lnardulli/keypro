
# Use an official Nginx runtime as a parent image
FROM nginx:alpine

# Copy the static files from the project root to the Nginx webroot
COPY index.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Expose port 80 to the outside world
EXPOSE 80

# Command to run Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
