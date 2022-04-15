FROM node:17.3

WORKDIR /usr/src/app   
#create directory inside container

COPY package.json ./

RUN npm install
# RUN yarn add openssl

COPY . .
#copying all files to current directory

# RUN npm run dev

EXPOSE 3000
