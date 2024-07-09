FROM python:3.11-bullseye

WORKDIR /app

COPY . /app

RUN python3 -m pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

ENV FLASK_APP=run.py

CMD ["flask", "run", "--host=0.0.0.0"]
