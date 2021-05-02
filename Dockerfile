FROM node:latest

ENV TOKEN_SECRET=3497bcd4d70a6ad26c932f647ab94de7dbc0991ced345c05fc1c1fe3fb39906149bf70b6f69c25238390c45060f42f885710924a770ce8c247371e2ec34b9137

ENV TWILIO_ACCOUNT_SID=AC5b6a211456385c4c07b42bfe0536a79c

ENV TWILIO_AUTH_TOKEN=dcc4c152b2583e322fd05d4642af3d29

ENV TWILIO_SERVICE_SID=VA6e1ea6593bb049405c8493cbc589989f

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install 

COPY . . 

EXPOSE 5000

CMD ["node","app.js" ]