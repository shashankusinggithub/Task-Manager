# Task Manager Application

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd task_manager
   ```

2. **Set up virtual environment and install dependencies**:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   Create a `.env` file in the project root and add the following:

   ```plaintext
   MONGO_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET_KEY=your_secret_key
   ```

4. **Run the application**:

   ```bash
   python run.py
   ```

5. **Running tests**:
   ```bash
   python -m unittest discover tests
   ```

## API Endpoints

- `POST /auth/register`: Register a new user
- `POST /auth/login`: Login a user and get a JWT token
- `GET /tasks`: Retrieve all tasks (requires JWT)
- `POST /tasks`: Create a new task (requires JWT)
- `GET /tasks/<task_id>`: Retrieve a task by ID (requires JWT)
- `PUT /tasks/<task_id>`: Update a task by ID (requires JWT)
- `DELETE /tasks/<task_id>`: Delete a task by ID (requires JWT)

## Assumptions

- Tasks have a title, description, and status (e.g., "To Do," "In Progress," "Done").
- MongoDB is used for data storage.
- Basic validation is performed to ensure tasks have a title.
- JWT is used for securing endpoints.
