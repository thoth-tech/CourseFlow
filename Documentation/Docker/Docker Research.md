# Docker Research

Thoth Tech wants the CourseFlow project team to incorporate a Docker into the application.

## Docker Notes

Followed this tutorial series to gain an understanding of Docker (React.js used in this series):

<https://www.youtube.com/watch?v=31ieHmcTUOk&list=PL4cUxeGkcC9hxjeEtdHFNYMtCpjNBm3h7>

Another link to provide more in-depth understanding of Dockers: <https://docs.docker.com/>

I’ve provided a summary below but you will likely gain a better understanding from following the series.

---

## What is a docker?

In terms of a use case which can help justify using this, the video in the Docker Crash Course #1 provides
a nice example:

- It all comes down to environment setup and team members needing to match the
requirements of a project (dependencies etc).
- They video used Node.js as an example, but in reality, this can extend to any application
development environment.
- In our case for CourseFlow, we have an environment for the Angular Application:
  - Any libraries that’s installed to achieve a specific feature will need to be installed by
everyone else as well.
  - Environment variables will also need to be setup.
  - Can be time consuming and may lead to problems.
- Docker containers help with this – we place all our dependencies, code etc into them.
  - Isolates our application from everything else.
  - Team members will need to have Docker though.
  - Can be configured for production servers.
  - Similar to virtual machines but more light weight.

---

## Installation

Follow the instructions in the documentation for your operating system:

<https://docs.docker.com/desktop/install/windows-install/>

The steps I took:

- Installed Docker Desktop for Windows.
  - There seems to be a requirement for WSL 2 (basically allows you to run Linux without
  installing a Linux VM).
  - I already had this installed on my pc.
  - The documents provide instructions on this.
- Signed up once installed via the client (will take you to their signup page).

## Docker Images and Containers

- Images:
  - The way I understood this based on the Docker Crash Course #3, is that it acts as a
  blueprint.
  - Essentially, various things such as the code we have for our application, dependencies
  for the application, environmental variables etc. goes into an image.
  - They are similar to snapshots that Virtual Machines environments use.
  - They are immutable, and can be shared, duplicated and deleted.
- Containers:
  - Containers will utilize those image blueprints to create an instance of the image.
  - This will run the application.
  - This is isolated from processes on our pc.
  The main takeaway from this is that we can use an image and share it among team members to be able
  to run the application on their pc, irrespective of what dependencies they have currently installed.
  - They require a runnable image to exist, therefore containers are dependant on images as they are used to make runtime environments and are needed to run an application.

The main takeaway from this is that we can use an image and share it among team members to be able to run the application on their pc, irrespective of what dependencies they have currently installed.

---

## Parent Images

- First layer in a multi-layered image system.
- Other layers can be source code, dependencies etc.
- This will contain the OS and the runtime environment (Node.js etc.)
- For example, if we want to install node.js as the parent image, we can open a terminal and use this:

'docker pull node'

- We can also specify the Linux distribution and node version. The above will just use the default
tag and get the latest version of node.
- This will create a new image which is visible in Docker Desktop (I assume the created 6 days ago
means it was updated 6 days ago):

![Alt text](image.png)

---

## Docker File

Basically, all of the different layers you want to build will go here. In other words, we define a set of
instructions that we want to occur when creating an image which can including:

1. Setting up the base parent image such as Node.
2. Creating the working directory inside the container.
3. Install Node packages.
4. Copy files over.
The following example sets up an image for angular:

```angular
FROM node:latest

ARG WORK_DIR=/frontend
ENV PATH ${WORK_DIR}/node_modules/.bin:$PATH

# Set the base working directory for the container..
RUN mkdir ${WORK_DIR}
WORKDIR ${WORK_DIR}

# Copy package files
COPY package.json ${WORK_DIR}
COPY package-lock.json ${WORK_DIR}

# Run npm installs
RUN npm install -g @angular/cli
RUN npm install

# Copy everything else
COPY . ${WORK_DIR}

EXPOSE 4200

CMD ng serve --host 0.0.0.0 --poll=3000
```

---

## Docker Compose File

This simplifies the creation of Docker Images, allows us to bind volumes to attach our local files to the container, and also allows us to run multiple containers in one go which will be useful when running a backend server and frontend server.

The following example is of a compose file for the front end only:

```angular
services:
  docker-angular:
    build:
      context: angular-docker
      dockerfile: Dockerfile
    ports:
      - '4200:4200'
    volumes:
      - ./angular-docker:/frontend
```

## Layer Caching

- Docker basically caches layers from other images to speed up the building process.
- So, if we make a change to the code, we need to re-build the image, but if we have an image already, the process will be quicker.
- Keep in mind, for this to work, I believe the order of operations will make a difference as to what gets checked for their cache.

## Volumes

- Gets around the issue of having to create a new image every time we want to see changes that
we made in code.
- We can map our local folder to a folder inside the container.
- Keep in mind though, the image will not change, so it will still need to be re-built when sharing between different computers/people.

---

## Terminal Commands

There are many docker image commands, but the primary sets of commands (Child commands) are:

### Show Images

```docker
docker images
```

### Show Running Processes

**only running processes:**

```docker
docker ps
```

**include non-running processes:**

```docker
docker ps -a
```

### Building and Image

**Specifying a name with -t:**

```docker
docker build -t <image-name> .
```

**Specifying version of image:**

```docker
docker build -t <image-name>:v1 .
```

### Running an image

**Create a container based on an image with the following flags where:**

- **name is the name of the container**
- **p allows us to map ports on our pc to the port exposed to the container**
- **d detaches the terminal so that it isn’t blocked while the process is running.**
- **rm removes the container once we have stopped the process.**
- **v maps local folder to the docker folder.**

```docker
docker run
--name <container-name>
-p <your port>:<exposed port>
-d
--rm
-v <local path>:<docker path>
<image-name>
```

### Starting a container

```docker
docker start <container-name>
```

### Stopping a container

```docker
docker stop <container-name>
```

### Delete an image (must not be used by a container – regardless if running)

```docker
docker image rm <image-name>
```

### Delete all images, containers and volumes

```docker
docker system prune -a
```

---

## Dockerizing Angular

- All of this was done from a new Angular project:
  - Hot-reload was not working.
  - Watched this tutorial which had hot reload working:
  <https://www.youtube.com/watch?v=_63tyWG7wy0>
  - Despite having more or less the same code, hot reload still didn’t work.
  - Changing volume paths didn’t work.
  - Solution that seems to work but can be slow and will basically check for changes every 3
  seconds which may be a problem:

Dockerfile:

```docker
FROM node:latest

ARG WORK_DIR=/frontend
ENV PATH ${WORK_DIR}/node_modules/.bin:$PATH

# Set the base working directory for the container..
RUN mkdir ${WORK_DIR}
WORKDIR ${WORK_DIR}

# Copy package files
COPY package.json ${WORK_DIR}
COPY package-lock.json ${WORK_DIR}

# Run npm installs
RUN npm install -g @angular/cli
RUN npm install

# Copy everything else
COPY . ${WORK_DIR}

EXPOSE 4200

CMD ng serve --host 0.0.0.0 --poll=3000
```

docker-compose:

```docker
services:
  docker-angular:
    build:
      context: angular-docker
      dockerfile: Dockerfile
    ports:
      - '4200:4200'
    volumes:
      - ./angular-docker:/frontend
```

- It is worth mentioning that there is an extension in vs code where if used, we can define a dev container json file which if configured correctly with a Docker file, can create a development container for us.

  - This technique worked great for Python and C++.
  - Tried this with angular and while it does work to an extent, operations such as running the ng commands and even deleting folders were extremely slow. Hot reload was either
  not working as well or was just super slow.
