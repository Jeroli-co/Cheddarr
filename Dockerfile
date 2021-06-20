FROM node:15.7.0-alpine AS FRONT_STAGE
WORKDIR /app

# Copy frontend sources
COPY /client ./client

# Install frontend dependencies and build
RUN cd client && yarn install && yarn cache clean && yarn build --production


FROM jerolico/cheddarr-base-image
WORKDIR /app

# Copy front build
COPY --from=FRONT_STAGE /app/client/build ./client/build

# Copy poetry.lock* in case it doesn't exist in the repo
COPY /pyproject.toml /poetry.lock* /app/

# Install Poetry and backend dependencies
RUN pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-root --no-dev

# Copy backend sources
COPY /server ./server
COPY cheddarr.py .

EXPOSE 9090
