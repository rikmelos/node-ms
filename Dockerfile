FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/Node-and-mongo-tutorial
WORKDIR /usr/src/Node-and-mongo-tutorial

# Install app dependencies
COPY package.json /usr/src/Node-and-mongo-tutorial/
RUN npm install

# Bundle app source
COPY . /usr/src/Node-and-mongo-tutorial

EXPOSE 5000
CMD [ "npm", "start" ]
