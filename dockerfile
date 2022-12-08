FROM debian:buster
# chạy các gói cài đặt
RUN apt update -y
RUN apt install curl -y && apt install sudo -y
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
RUN apt update -y && apt install nodejs -y
RUN npm install pm2 -g

#thêm các file ứng dụng vào image
ADD . /cpaas-application

#thư mục gốc của image
WORKDIR /cpaas-application

#image sẽ nghe port này
EXPOSE 3000
#chạy ứng dụng khi khởi động container
CMD ["pm2-runtime", "ecosystem.config.js"]
