### README for Docker-Compose with MongoDB, Nginx, Frontend, and Backend

This project sets up a full-stack task management application with React for the frontend, Flask for the backend, MongoDB for the database, and Nginx for reverse proxying, using Docker Compose for orchestration.

### Prerequisites

Ensure you have the following installed on your system:

- Docker
- Docker Compose

### Project Structure

The project structure should look like this:

```
.
├── backend
│   ├── app
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── routes.py
│   │   ├── auth_routes.py
│   ├── Dockerfile
│   ├── requirements.txt
├── frontend
│   ├── public
│   │   ├── index.html
│   ├── src
|   |   ├── __tests__
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── styles.css
│   ├── Dockerfile
│   ├── package.json
├── nginx
│   ├── nginx.conf
├── docker-compose.yml
```

### Docker Compose Configuration

Here is the `docker-compose.yml` configuration:

```yaml
services:
  backend:
    build:
      context: ./backend
    environment:
      - FLASK_ENV=development
      - DATABASE_URL=mongodb://mongo:27017/shashank
      - SECRET_KEY=pesto
    depends_on:
      - mongo

  frontend:
    build:
      context: ./frontend
    environment:
      - NODE_ENV=development

  mongo:
    image: mongo:latest
    volumes:
      - mongo_data:/data/db

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend
      - frontend

volumes:
  mongo_data:
```

### Backend Setup

1. **Dockerfile for Backend (`backend/Dockerfile`)**:

   ```dockerfile
   FROM python:3.8-slim

   WORKDIR /app

   COPY requirements.txt requirements.txt
   RUN pip install -r requirements.txt

   COPY . .

   ENV FLASK_APP=app
   CMD ["flask", "run", "--host=0.0.0.0"]
   ```

2. **Requirements File (`backend/requirements.txt`)**:

   ```plaintext
   Flask
   Flask-JWT-Extended
   pymongo
   Flask-Cors
   ```

3. **Example Backend Files**:
   - `__init__.py`, `models.py`, `routes.py`, `auth_routes.py` should be set up based on your Flask application code.

### Frontend Setup

1. **Dockerfile for Frontend (`frontend/Dockerfile`)**:

   ```dockerfile
   FROM node:14

   WORKDIR /app

   COPY package.json package.json
   RUN npm install

   COPY . .

   CMD ["npm", "start"]
   ```

2. **Example Frontend Files**:
   - `public/index.html`, `src/components`, `src/pages`, `src/services`, `App.js`, `index.js`, `styles.css` should be set up based on your React application code.

### Nginx Configuration

1. **Nginx Configuration File (`nginx/nginx.conf`)**:

   ```nginx
   server {
       listen 80;

       location / {
           proxy_pass http://frontend:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       location /api {
           proxy_pass http://backend:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

### Running the Application

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Build and run the containers**:

   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - The frontend can be accessed at `http://localhost`
   - The backend API can be accessed via Nginx at `http://localhost/api`

### Additional Notes

- Make sure the `DATABASE_URL` in the backend environment variables matches the MongoDB service name in `docker-compose.yml`.
- Adjust the `SECRET_KEY` and other environment variables as needed for your setup.

This setup ensures a complete development environment using Docker, allowing easy setup and consistent environments across different development machines.
