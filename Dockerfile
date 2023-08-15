FROM node:20-alpine AS FRONT_STAGE

WORKDIR /app

# Copy frontend sources
COPY /client ./client

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

# Install pnpm
# RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

# Install frontend dependencies and build
# RUN cd client && pnpm install && pnpm cache clean && pnpm build --production
RUN cd client && pnpm install --frozen-lockfile --prod && pnpm build


FROM python:3.11.2-slim
WORKDIR /app

# Copy front build
COPY --from=FRONT_STAGE /app/client/dist ./client/dist

# Copy poetry.lock* in case it doesn't exist in the repo
COPY /pyproject.toml /poetry.lock* /app/

# Install Poetry and backend dependencies
RUN pip install poetry alembic && \
    poetry config virtualenvs.create false && \
    poetry install --no-root --no-dev

# Copy backend sources
COPY /server ./server
COPY cheddarr.py .

EXPOSE 9090
ENTRYPOINT ["python", "cheddarr.py", "run"]
