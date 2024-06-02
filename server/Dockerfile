FROM node:16-alpine

# Create a directory for the app
WORKDIR /app

# Copy the tsconfig.json file
COPY tsconfig.json /app/

# Copy package.json
COPY package.json yarn.lock /app/

# Install dependencies
RUN yarn install

# Copy the rest of the files to the app directory
COPY . .

# Build the server app
RUN yarn run build

# Expose port 8001 for the server
EXPOSE 8001

# Start the server
CMD ["yarn", "start"]
