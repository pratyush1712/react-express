# Base image
FROM node:16-alpine

# Create a directory for the app
WORKDIR /app

# Copy package.jsons first to install
COPY package.json /app/
COPY client/package.json client/yarn.lock /app/client/
COPY server/package.json server/yarn.lock /app/server/

# Install server dependencies
WORKDIR /app/server
RUN yarn install

# Install client dependencies and set environment variables
WORKDIR /app/client
ARG REACT_APP_CLIENT_ID
ENV REACT_APP_CLIENT_ID ${REACT_APP_CLIENT_ID}
ARG REACT_APP_PUBLIC_URL
ENV REACT_APP_PUBLIC_URL ${REACT_APP_PUBLIC_URL}
RUN yarn install

# Copy the client and server directories to the app directory
WORKDIR /app
COPY client /app/client
COPY server /app/server
COPY tsconfig.base.json /app/
COPY . .

# Build the client app
WORKDIR /app/client
RUN yarn run build

# Build the server
WORKDIR /app/server
RUN yarn run build

# Expose port 8001 for the server
EXPOSE 8001

# Start the server
CMD ["yarn", "start"]
