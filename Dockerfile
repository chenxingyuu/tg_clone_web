FROM nginx:latest
LABEL authors="chenxingyu"

# Copy the contents of the 'dist' directory from the build context
# to the '/usr/share/nginx/html/' directory in the container.
# This is where Nginx serves static files from.
COPY dist/ /usr/share/nginx/html/

# Expose ports
EXPOSE 80

# Set the default command to execute
# when creating a new container
CMD service nginx start

