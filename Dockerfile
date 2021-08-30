# Use Node 12 or higher
FROM node:14

# Create the app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./


# Install the Gatsby CLI 2.x.x 
RUN npm install -g gatsby-cli@2.19.3
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
RUN gatsby build

# Bundle app source
COPY . .

EXPOSE 9000
CMD [ "gatsby","serve" ]