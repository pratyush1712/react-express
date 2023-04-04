FROM node:16-alpine

# Create a directory for the app
WORKDIR /app

# Copy package.json
COPY package.json /app/

# Install dependencies
RUN yarn install

# Copy the directory to the app directory
COPY . .

# Build the server app
RUN yarn run build

# Expose port 8001 for the server
EXPOSE 8001

# Start the server
CMD ["yarn", "start"]