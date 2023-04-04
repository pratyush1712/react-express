# Base image
FROM node:16-alpine

# Create a directory for the app
WORKDIR /app

ENV NODE_ENV=production

# Read build-time environment variables
ARG REACT_APP_CLIENT_ID
ENV REACT_APP_CLIENT_ID ${REACT_APP_CLIENT_ID}
ARG REACT_APP_PUBLIC_URL
ENV REACT_APP_PUBLIC_URL ${REACT_APP_PUBLIC_URL}

# Copy package.jsons first to install
COPY package.json /app/
COPY client/package.json client/yarn.lock /app/client/
COPY server/package.json server/yarn.lock /app/server/

# Install dependencies for the client and build the app
WORKDIR /app/client
RUN yarn install --production
COPY client /app/client
RUN yarn run build

# Install dependencies for the client and build the app
WORKDIR /app/server
RUN yarn install --production
COPY server /app/server
RUN yarn run build

# Expose port 3001 for the server
EXPOSE 8001

# Start the server
CMD ["yarn", "start"]