FROM node:15.7.0-alpine AS FRONT_STAGE
WORKDIR /app
COPY /client ./client
RUN cd client && yarn install && yarn cache clean && yarn build --production


FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-slim
WORKDIR /app
COPY --from=FRONT_STAGE /app/client/build ./client/build
COPY /server ./server
COPY cheddarr.py .
COPY requirements.txt .
RUN pip3 install --upgrade pip && pip3 install -r requirements.txt
RUN alembic upgrade head
ENTRYPOINT ["python", "cheddarr.py", "run"]
EXPOSE 9090
