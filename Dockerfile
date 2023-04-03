# Base image
FROM node:16-alpine

# Create a directory for the app
WORKDIR /app

# Copy package.jsons first to install
COPY package.json package-lock.json /app/
COPY client/package.json client/package-lock.json /app/frontend/
COPY server/package.json server/package-lock.json /app/server/
RUN yarn install

# Copy the frontend and server directories to the app directory
COPY client /app/client
COPY server /app/server
COPY . .

# Install dependencies for the frontend and build the app
WORKDIR /app/client
RUN yarn run build

# Install dependencies for the server
WORKDIR /app/server
RUN yarn run build

# Expose port 3001 for the server
EXPOSE 8001

# Start the server
CMD ["yarn", "start"]