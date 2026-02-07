# Task Management System

A simple task management REST API built with Spring Boot, MySQL, and JWT authentication - similar to ServiceNow but simplified.

## Features

- **User Authentication**: Register and login with JWT token-based authentication
- **Task Management**: Full CRUD operations for tasks
- **User Association**: Tasks linked to creators and assignees
- **Status Tracking**: NEW, IN_PROGRESS, COMPLETED, CLOSED
- **Priority Levels**: LOW, MEDIUM, HIGH, CRITICAL
- **Secure API**: Protected endpoints with JWT

## Tech Stack

- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- MySQL 8.0
- Maven
- Lombok
- Docker & Docker Compose

## Project Structure

```
src/main/java/com/taskmanagement/
├── TaskManagementApplication.java
├── controller/
│   ├── AuthController.java
│   └── TaskController.java
├── service/
│   ├── AuthService.java
│   └── TaskService.java
├── repository/
│   ├── UserRepository.java
│   └── TaskRepository.java
├── model/
│   ├── User.java
│   ├── Task.java
│   ├── TaskStatus.java
│   └── TaskPriority.java
├── dto/
│   ├── LoginRequest.java
│   ├── RegisterRequest.java
│   ├── AuthResponse.java
│   ├── TaskRequest.java
│   └── TaskResponse.java
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   ├── SecurityConfig.java
│   └── UserDetailsServiceImpl.java
└── exception/
    ├── GlobalExceptionHandler.java
    └── ResourceNotFoundException.java
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    priority VARCHAR(50),
    assigned_to_id BIGINT,
    created_by_id BIGINT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    due_date DATE,
    FOREIGN KEY (assigned_to_id) REFERENCES users(id),
    FOREIGN KEY (created_by_id) REFERENCES users(id)
);
```

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0 (or use Docker)
- Docker & Docker Compose (optional)

### Option 1: Run with Docker (Recommended)

1. **Clone the repository**
```bash
cd task-management-system
```

2. **Start the application with Docker Compose**
```bash
docker-compose up -d
```

This will:
- Start MySQL container on port 3306
- Build and start the Spring Boot application on port 8080
- Create the database automatically

3. **Check logs**
```bash
docker-compose logs -f app
```

4. **Stop the application**
```bash
docker-compose down
```

### Option 2: Run Locally

1. **Install MySQL and create database**
```bash
mysql -u root -p
CREATE DATABASE task_management_db;
```

2. **Update application.properties** (if needed)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/task_management_db
spring.datasource.username=root
spring.datasource.password=your_password
```

3. **Build the project**
```bash
mvn clean install
```

4. **Run the application**
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe"
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe"
}
```

### Task Endpoints (Protected - Require JWT)

**Note:** Include the JWT token in the Authorization header for all task endpoints:
```
Authorization: Bearer <your_jwt_token>
```

#### 3. Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Implement login feature",
  "description": "Add JWT authentication to the application",
  "status": "NEW",
  "priority": "HIGH",
  "assignedToId": 2,
  "dueDate": "2026-03-01"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Implement login feature",
  "description": "Add JWT authentication to the application",
  "status": "NEW",
  "priority": "HIGH",
  "assignedToId": 2,
  "assignedToName": "janedoe",
  "createdById": 1,
  "createdByName": "johndoe",
  "createdDate": "2026-02-08T10:30:00",
  "updatedDate": "2026-02-08T10:30:00",
  "dueDate": "2026-03-01"
}
```

#### 4. Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Implement login feature",
    "description": "Add JWT authentication to the application",
    "status": "NEW",
    "priority": "HIGH",
    "assignedToId": 2,
    "assignedToName": "janedoe",
    "createdById": 1,
    "createdByName": "johndoe",
    "createdDate": "2026-02-08T10:30:00",
    "updatedDate": "2026-02-08T10:30:00",
    "dueDate": "2026-03-01"
  }
]
```

#### 5. Get Task by ID
```http
GET /api/tasks/{id}
Authorization: Bearer <token>
```

**Response:** Same as Create Task response

#### 6. Update Task
```http
PUT /api/tasks/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Implement login feature - Updated",
  "description": "Add JWT authentication and refresh token",
  "status": "IN_PROGRESS",
  "priority": "CRITICAL",
  "assignedToId": 2,
  "dueDate": "2026-02-28"
}
```

**Response:** Updated task object

#### 7. Delete Task
```http
DELETE /api/tasks/{id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

## Task Status Options
- `NEW` - Newly created task
- `IN_PROGRESS` - Work in progress
- `COMPLETED` - Task completed
- `CLOSED` - Task closed

## Task Priority Options
- `LOW` - Low priority
- `MEDIUM` - Medium priority (default)
- `HIGH` - High priority
- `CRITICAL` - Critical priority

## Testing with cURL

### Register a new user
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'
```

### Create a task (replace TOKEN with actual JWT)
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "status": "NEW",
    "priority": "HIGH",
    "dueDate": "2026-03-01"
  }'
```

### Get all tasks
```bash
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

## Testing with Postman

1. Import the collection or create requests manually
2. For authentication endpoints (`/api/auth/*`), no token needed
3. For task endpoints (`/api/tasks/*`):
   - Go to Authorization tab
   - Select "Bearer Token"
   - Paste your JWT token

## Security Configuration

- Passwords are encrypted using BCrypt
- JWT tokens expire after 24 hours (configurable in `application.properties`)
- Stateless session management
- CORS enabled for all origins (configure for production)

## Configuration

Key configuration in `application.properties`:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/task_management_db
spring.datasource.username=root
spring.datasource.password=root

# JWT
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000
```

## Error Handling

The application includes global exception handling:

- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Invalid/missing JWT token
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server errors

## Business Logic

### Task Permissions
- Users can see tasks they created or are assigned to
- Only task creators can delete tasks
- Both creators and assignees can update tasks

### Auto-assignment
- When creating a task, the creator is automatically set
- Assignee is optional and can be set later

## Future Enhancements

- [ ] Add user roles (ADMIN, USER)
- [ ] Task comments and attachments
- [ ] Email notifications
- [ ] Task search and filtering
- [ ] Task history/audit log
- [ ] Due date reminders
- [ ] Dashboard analytics
- [ ] Export tasks to CSV/PDF

## License

This project is open source and available under the MIT License.

## Contact

For questions or support, please open an issue in the repository.
