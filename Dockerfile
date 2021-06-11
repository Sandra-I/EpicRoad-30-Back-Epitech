
# Specifies the image of your engine
FROM node:12.22.1

# The working directory inside your container
WORKDIR /app

# Get the package.json first to install dependencies
COPY package.json /app

# This will install those dependencies
RUN npm install

# Copy the rest of the app to the working directory
COPY . /app

RUN CI=true

# Run the container
CMD ["npm", "start"]