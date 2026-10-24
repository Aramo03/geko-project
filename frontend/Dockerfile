# syntax=docker/dockerfile:1

# --- Build stage: production bundle (never the Vite dev server) ---
FROM node:20-alpine AS build
WORKDIR /app

# Install from the lockfile only, so builds are reproducible.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Empty means same-origin /api (nginx or the Vite proxy). Set an absolute
# URL only when the API really lives on another host.
ARG VITE_BASE_URL=
ENV VITE_BASE_URL=$VITE_BASE_URL
RUN npm run build

# --- Runtime stage: static files via nginx ---
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
