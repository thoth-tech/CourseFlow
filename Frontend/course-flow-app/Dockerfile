# Base image.
FROM node:18-alpine

# Create a variable for the working directory.
ARG WORK_DIR=/frontend

# Set this so that local node module executables can be called.
ENV PATH ${WORK_DIR}/node_modules/.bin:$PATH

# Set the base working directory for the container.
RUN mkdir ${WORK_DIR}
WORKDIR ${WORK_DIR}

# Copy package files
COPY package.json ${WORK_DIR}
COPY package-lock.json ${WORK_DIR}

# Run npm installs
RUN npm install -g @angular/cli
RUN npm install

# Copy everything else - use the docker ignore file to ignore directories and files that you don't want copied over.
COPY . ${WORK_DIR}

# Expose port.
EXPOSE 4200

# Run ng serve on container creation - the poll will allow for hot reload to work.
CMD ng serve --host 0.0.0.0 --poll=1000