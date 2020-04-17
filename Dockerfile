FROM python:3.7

ENV APP_DIR=app

RUN apt update && \
    apt upgrade -y && \
    apt clean && \
    pip3 install -I pipenv==2018.11.26

COPY . ${APP_DIR}

WORKDIR $APP_DIR

RUN pipenv install --deploy

CMD ["pipenv", "run", "python", "app.py"]
