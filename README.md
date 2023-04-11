# Harmonious Sounds

Welcome to Harmonious Sounds - a web app built with React, Express, Flask, and Nginx, with a focus on improving DevOps skills. The app follows a microservices architecture and has been deployed using **Okteto**.

## Features

- View your top tracks and artists on Spotify
- See some insights about your top tracks:
  - average danceability, energy, valence, etc...
  - top artists and genres
  - top tracks and artists by decade
- See a happiness score for your favorite playlists, calculated using machine learning

Website Link: https://nginx-devops-pratyush1712.cloud.okteto.net/

## Prerequisites

Before you begin building and running the app, make sure you have the following installed:

- Node
- Yarn package manager
- Okteto CLI
- Docker
- Docker Compose

## Installation Guide

To install and run the app, follow these steps:

- Clone this repository to your local machine.

```
git clone https://github.com/pratyush1712/harmonious-sounds.git
```

- Navigate to the root directory of the project in your terminal.

```
cd harmonious-sounds
```

- Install the dependencies for the client and server directories.

```
yarn run install
```

- Start the development server.

```
yarn run dev
```

Once the app is running, you can access it by navigating to `http://localhost:8000` in your web browser.
The following microservices will be running:

- Client: `http://localhost:8000`
- Server: `http://localhost:8001`
- Model: `http://localhost:8002`

## Microservices

The app consists of the following microservices:

### Web

The web service is built with React and Express. It allows users to log in to their Spotify account, view their top tracks and artists, and listen to their favorite tracks.

### Model

The Flask-based model microservice utilizes machine learning and data analytics to provide users with insights about their top Spotify tracks. The model microservice is multi-threaded to speed up requests.

<ins>Logistic regression</ins> is used to predict the happiness score of a track based on its audio features. The model is trained on a dataset of <ins>1000+ tracks</ins>, and the <ins>accuracy of the model is 88%</ins>.

### Nginx

The nginx service acts as a reverse proxy and is used to route requests between the web and model services.

## DevOps Pipelines

To ensure code readability, I have used `eslint` and `prettier`. The app also uses `yarn` as its package manager.

I have implemented DevOps pipelines to automate the build and deployment process. The pipelines include the following steps:

- Linting the code to ensure it meets the coding standards
- Building the client and server directories
- Containerizing the app using Docker
- Pushing the Docker image to a container registry
- Deploying the app to staging using Okteto

For every pull request, a preview environment is automatically created in Okteto. This preview environment
allows you to test your changes in a realistic environment before merging them into the main branch.
Once you have reviewed your changes and are satisfied with them, you can merge your pull request
into the main branch and trigger the deployment pipeline.

To use these pipelines, you will need to set up an Okteto account and configure it to work with
your GitHub repository. You will also need to set up a Docker account and container registry.

Once you have set up these accounts and configured them to work with your repository, any changes pushed to the `master` branch
will trigger the pipeline. You can monitor the progress of the pipeline in the Okteto dashboard, and once it is complete,
you should be able to access the app in your Okteto environment.

Thank you for using my Harmonious Sounds web app! If you have any questions or feedback, please feel free to contact me.
