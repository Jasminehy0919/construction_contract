# Stage 1: Build the app
FROM node:20-alpine AS build

WORKDIR /app

# Speed up npm: longer timeout, retries, show progress
ENV NPM_CONFIG_FETCH_TIMEOUT=120000
ENV NPM_CONFIG_FETCH_RETRIES=5
ENV NPM_CONFIG_LOGLEVEL=info

# Optional: use mirror if npmjs.org is slow (uncomment if needed, e.g. in China)
# ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com

COPY package.json ./
RUN npm install --prefer-offline --no-audit

COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
