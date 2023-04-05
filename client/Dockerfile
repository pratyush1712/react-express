FROM node:16-alpine

# Create a directory for the app
WORKDIR /app

# Copy package.json
COPY package.json yarn.lock /app/

# Install dependencies
ARG REACT_APP_CLIENT_ID
ENV REACT_APP_CLIENT_ID ${REACT_APP_CLIENT_ID}
ARG REACT_APP_PUBLIC_URL
ENV REACT_APP_PUBLIC_URL ${REACT_APP_PUBLIC_URL}
RUN yarn install

# Copy the directory to the app directory
COPY . .

# Build the client app
RUN yarn run build

# Expose port 8000 for the client
FROM nginx
EXPOSE 8000
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/build /usr/share/nginx/html
