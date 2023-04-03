# React Express + DevOps

Welcome to React Express + DevOps - a web app built with React and Express, with a focus on
improving DevOps skills. The app follows a basic React-Express architecture and has been deployed using **Okteto**.

Website Link: https://app-devops-pratyush1712.cloud.okteto.net/

## Prerequisites

Before you begin building and running the app, make sure you have the following installed:

- Node
- Yarn package manager
- Okteto CLI

## Installation Guide

To install and run the app, follow these steps:

- Clone this repository to your local machine.

```
git clone https://github.com/pratyush1712/react-express.git
```

- Navigate to the root directory of the project in your terminal.

```
cd react-express
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

Thank you for using my React Express web app! If you have any questions or feedback, please feel free to contact me.
