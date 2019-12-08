FROM node:12-alpine as builder

WORKDIR /usr/src/app

COPY . ./

RUN npm ci
RUN npm run build-all-prod
RUN npm prune

FROM node:12-alpine
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/server-dist ./server-dist
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/package*.json ./

USER node

EXPOSE 3000

CMD ["npm", "run", "start-prod"]