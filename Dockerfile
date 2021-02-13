FROM node:15.7.0-alpine AS FRONT_STAGE
WORKDIR /app

# Copy frontend sources
COPY /client ./client

# Install frontend dependencies and build
RUN cd client && yarn install && yarn cache clean && yarn build --production


FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-slim
WORKDIR /app

# Copy front build
COPY --from=FRONT_STAGE /app/client/build ./client/build

# Copy backend sources
COPY /server ./server
COPY cheddarr.py .

# Install Poetry
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

# Copy poetry.lock* in case it doesn't exist in the repo
COPY ./app/pyproject.toml ./app/poetry.lock* /app/

# Install backend dependencies
RUN poetry install --no-root --no-dev

# Run migration
RUN alembic upgrade head

ENTRYPOINT ["python", "cheddarr.py", "run"]
EXPOSE 9090
