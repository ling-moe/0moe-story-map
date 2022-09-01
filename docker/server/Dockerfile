FROM node:16-alpine3.15
COPY server /server
RUN cd /server \
  && npm i
CMD [" cd /server && npm run start"]

