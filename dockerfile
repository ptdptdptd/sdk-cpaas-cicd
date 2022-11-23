FROM debian:buster

RUN apt update -y
RUN apt install curl -y
RUN apt install sudo -y
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
RUN apt update -y && apt install nodejs -y
RUN npm install pm2 -g

ADD . /cpaas-application

WORKDIR /cpaas-application

EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]
