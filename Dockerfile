# Runtime Stage
FROM node:12-alpine

ENV APP_HOME=/usr/app
WORKDIR $APP_HOME

COPY . .
RUN yarn install --production=true

CMD ["node", "nyan-bot"]
