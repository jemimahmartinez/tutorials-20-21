# This Dockerfile uses the Ubuntu 18.04 image
FROM ubuntu:18.04

# The `RUN` instructions update the package caches, 
# install some software packages for the web server, and then write the "Hello World!" content to the web server's document root.

# Install dependencies
RUN apt-get update && \
 apt-get -y install apache2

# Install apache and write hello world message
RUN echo 'Hello World!' > /var/www/html/index.html

# Configure apache
RUN echo '. /etc/apache2/envvars' > /root/run_apache.sh && \
 echo 'mkdir -p /var/run/apache2' >> /root/run_apache.sh && \
 echo 'mkdir -p /var/lock/apache2' >> /root/run_apache.sh && \ 
 echo '/usr/sbin/apache2 -D FOREGROUND' >> /root/run_apache.sh && \ 
 chmod 755 /root/run_apache.sh

# The `EXPOSE` instruction exposes port 80 on the container
EXPOSE 80

# The `CMD` instruction starts the web server
CMD /root/run_apache.sh