Arcade of Infinite Monotonous Fun
=================================

Things of fun.

## Setup

### Development

```
pipenv install --dev
pipenv run python app.py
```

Then visit `http://localhost:5000`.

To run a full-stack locally with multiple instances of the application:

```
docker-compose up

# or

docker-compose up --scale app=5
```

Then visit `http://localhost:4000`.
