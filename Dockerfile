# TODO: We don't always want to pull the latest for stability
FROM node:latest

# Create image directory structure
RUN mkdir /app 
COPY . /app

# Initialize the server dependencies
WORKDIR /app
RUN npm install 

# Start the server
CMD [ "npm", "start" ]