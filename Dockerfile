FROM node:25-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@11.22.0
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src

CMD ["pnpm", "dev"]
