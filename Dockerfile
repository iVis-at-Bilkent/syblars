FROM node:14.18.0

# install git
RUN apt-get update
RUN apt-get install -y git

# clone the repository
RUN git clone https://github.com/iVis-at-Bilkent/syblars.git
WORKDIR syblars

# install dependencies
RUN npm install
# install missing libraries for puppeteer
RUN apt-get install -y libgtk2.0-0 libgtk-3-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb libgbm-dev

# set server start as entry point
ENTRYPOINT npm run start