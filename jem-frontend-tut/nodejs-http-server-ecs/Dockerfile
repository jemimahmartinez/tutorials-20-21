# WHere we specify our base image
# FROM node:8-alpine
FROM node:latest 

# `RUN` allows us to execute a command for anything you want to do
# In this case, we created a subdirectory `/usr/src/app` that will hold our application code within the docker image
RUN mkdir -p /usr/src/app

# Estabilishes a subdirectory as the working directory for any `RUN`, `CMD`, `ENTRYPOINT`, `COPY`, `ADD` instructions that follow it in the Dockerfile
WORKDIR /usr/src/app

#`COPY` lets up copy files from a source to a destination
# We copied thecontents of our node application code (index.js and package.json) from our current directory to the working directory in our docker image
COPY . .

RUN npm install 

# `EXPOSE` informs Docker that the container listens on the specified network ports at runtime - we specified port 8080
EXPOSE 3000
# `CMD` specifies the command to start our application - tells docker how to run our application
CMD [ "node", "index.js"]