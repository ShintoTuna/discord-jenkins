FROM    node:7-alpine
ENV     PORT 3333

RUN     mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD . /usr/src/app
RUN     yarn install 
EXPOSE  $PORT

CMD ["npm", "start"]        
