# Taskflow: A Collaborative Project Management & Task Tracking Application

## 📖 Project Description

Taskflow is a full-stack project management application designed to streamline workflow and enhance team collaboration. It provides a centralized platform for creating projects, managing tasks through their lifecycle, and assigning responsibilities to team members. The application is built with a modern tech stack, featuring a Next.js frontend and a robust Node.js backend, fully deployed on AWS.

---

## 🛠️ Tech Stack

The project is built using a modern, scalable, and type-safe technology stack.

| Category      | Technology                                                     |
| :------------ | :------------------------------------------------------------- |
| **Frontend** | Next.js, React                                                 |
| **Backend** | Node.js, Express.js, TypeScript                                |
| **Database** | PostgreSQL                                                     |
| **ORM** | Prisma                                                         |
| **Deployment**| **AWS**: EC2, RDS, S3, Cognito, Amplify                        |
| **API Testing**| Postman                                                        |

---

## ✨ Key Features

-   **Full CRUD Functionality:** A complete suite of RESTful API endpoints for all core entities, allowing users to Create, Read, Update, and Delete projects, tasks, teams, and user profiles.
-   **Relational Data Modeling:** A well-designed PostgreSQL schema managed by Prisma, establishing clear relationships between users, teams, projects, and tasks to ensure data integrity.
-   **Task Management:** Create tasks with detailed attributes such as status (e.g., "To Do", "In Progress"), priority, tags, and start/due dates.
-   **User & Team Assignments:** Assign tasks to specific users and projects to teams, creating a clear structure of ownership.
-   **API Validation:** The backend includes robust validation for all incoming data, preventing common issues like invalid date formats or missing required fields.

---

## 🚀 Getting Started

Follow these instructions to get the backend server up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm or yarn
-   PostgreSQL
-   Git

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/taskflow-project.git](https://github.com/your-username/taskflow-project.git)
    cd taskflow-project/server
    ```

2.  **Install backend dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    -   Create a new file named `.env` in the `server` directory.
    -   Add your database connection string to this file. Replace the placeholders with your actual credentials.
    ```env
    # .env
    DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/YOUR_DATABASE_NAME?schema=public"
    ```

4.  **Run the database migrations:**
    This command will create all the necessary tables in your database based on the `schema.prisma` file.
    ```bash
    npx prisma migrate dev
    ```

5.  **Seed the database:**
    This command will populate your database with initial sample data.
    ```bash
    npx prisma db seed
    ```

6.  **Start the server:**
    ```bash
    npm run dev 
    ```
    The server should now be running, typically on `http://localhost:8000`.

---

## 🔌 API Endpoints

Here are the main API endpoints that have been implemented:

| Method | Endpoint                    | Description                               |
| :----- | :-------------------------- | :---------------------------------------- |
| `GET`  | `/projects`                 | Retrieves a list of all projects.         |
| `POST` | `/projects`                 | Creates a new project.                    |
| `GET`  | `/tasks`                    | Retrieves a list of all tasks.            |
| `GET`  | `/tasks?projectId={id}`     | Retrieves all tasks for a specific project.|
| `POST` | `/tasks`                    | Creates a new task.                       |

_More endpoints for users, teams, etc., can be added here as they are developed._

