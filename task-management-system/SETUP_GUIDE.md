# Task Management System - Complete Setup Guide

## 🎯 Project Overview

A full-stack task management REST API similar to ServiceNow, built with:
- **Backend**: Java 17, Spring Boot 3.2, Spring Security, JWT
- **Database**: MySQL 8.0
- **Build Tool**: Maven
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
task-management-system/
├── src/main/java/com/taskmanagement/
│   ├── TaskManagementApplication.java      # Main application entry point
│   ├── controller/                          # REST API endpoints
│   │   ├── AuthController.java             # Login/Register endpoints
│   │   └── TaskController.java             # Task CRUD endpoints
│   ├── service/                             # Business logic layer
│   │   ├── AuthService.java                # Authentication logic
│   │   └── TaskService.java                # Task management logic
│   ├── repository/                          # Data access layer
│   │   ├── UserRepository.java             # User database operations
│   │   └── TaskRepository.java             # Task database operations
│   ├── model/                               # Entity classes
│   │   ├── User.java                       # User entity
│   │   ├── Task.java                       # Task entity
│   │   ├── TaskStatus.java                 # Status enum
│   │   └── TaskPriority.java               # Priority enum
│   ├── dto/                                 # Data Transfer Objects
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── AuthResponse.java
│   │   ├── TaskRequest.java
│   │   └── TaskResponse.java
│   ├── security/                            # Security configuration
│   │   ├── JwtTokenProvider.java           # JWT token generation/validation
│   │   ├── JwtAuthenticationFilter.java    # JWT filter
│   │   ├── SecurityConfig.java             # Spring Security config
│   │   └── UserDetailsServiceImpl.java     # User authentication
│   └── exception/                           # Exception handling
│       ├── GlobalExceptionHandler.java
│       └── ResourceNotFoundException.java
├── src/main/resources/
│   └── application.properties               # Application configuration
├── database/
│   └── schema.sql                           # Database schema (reference)
├── pom.xml                                  # Maven dependencies
├── Dockerfile                               # Docker image configuration
├── docker-compose.yml                       # Multi-container setup
├── start.sh                                 # Quick start script
├── test-api.sh                              # API testing script
├── postman_collection.json                  # Postman collection
└── README.md                                # Documentation

```

## 🚀 Quick Start

### Method 1: Docker (Recommended)

```bash
# Start everything with one command
./start.sh

# Or manually:
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down
```

### Method 2: Local Development

**Prerequisites:**
- Java 17+
- Maven 3.6+
- MySQL 8.0

**Steps:**

1. **Start MySQL**
```bash
# Create database
mysql -u root -p
CREATE DATABASE task_management_db;
```

2. **Configure application**
Edit `src/main/resources/application.properties` if needed:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. **Build and run**
```bash
# Build
mvn clean install

# Run
mvn spring-boot:run

# Or run the JAR
java -jar target/task-management-system-1.0.0.jar
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Authentication (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and get JWT token |

### Tasks (Protected - Requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tasks` | Create new task |
| GET | `/tasks` | Get all tasks (user's tasks) |
| GET | `/tasks/{id}` | Get specific task |
| PUT | `/tasks/{id}` | Update task |
| DELETE | `/tasks/{id}` | Delete task |

## 🧪 Testing

### Using the test script
```bash
./test-api.sh
```

### Using cURL

**1. Register**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "pass123",
    "fullName": "John Doe"
  }'
```

**2. Login**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "pass123"
  }'
```
Save the token from response!

**3. Create Task**
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First Task",
    "description": "Task description",
    "status": "NEW",
    "priority": "HIGH",
    "dueDate": "2026-03-01"
  }'
```

**4. Get All Tasks**
```bash
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import `postman_collection.json`
2. The collection automatically saves the JWT token after login
3. Run requests in order: Register → Login → Create Task → etc.

## 📊 Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `password` - BCrypt hashed password
- `full_name` - User's full name
- `created_date` - Timestamp
- `updated_date` - Timestamp

### Tasks Table
- `id` - Primary key
- `title` - Task title
- `description` - Task description
- `status` - NEW, IN_PROGRESS, COMPLETED, CLOSED
- `priority` - LOW, MEDIUM, HIGH, CRITICAL
- `assigned_to_id` - Foreign key to users (optional)
- `created_by_id` - Foreign key to users (required)
- `created_date` - Timestamp
- `updated_date` - Timestamp
- `due_date` - Due date

## 🔐 Security Features

- **Password Encryption**: BCrypt with strength 10
- **JWT Authentication**: Stateless token-based auth
- **Token Expiration**: 24 hours (configurable)
- **CORS**: Enabled for all origins (configure for production)
- **Authorization**: User can only access their own tasks
- **Input Validation**: Bean validation on all inputs

## 🎨 Key Features

### User Management
- ✅ User registration with validation
- ✅ User login with JWT token generation
- ✅ Password encryption
- ✅ Email and username uniqueness validation

### Task Management
- ✅ Create tasks with title, description, status, priority
- ✅ Assign tasks to other users
- ✅ Update task details
- ✅ Delete tasks (only by creator)
- ✅ View all tasks (created by or assigned to user)
- ✅ Due date tracking

### Business Rules
- Users can see tasks they created or are assigned to
- Only creators can delete tasks
- Both creators and assignees can update tasks
- Default status: NEW
- Default priority: MEDIUM

## ⚙️ Configuration

### Application Properties

**Server**
```properties
server.port=8080
```

**Database**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/task_management_db
spring.datasource.username=root
spring.datasource.password=root
```

**JPA/Hibernate**
```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**JWT**
```properties
jwt.secret=YOUR_SECRET_KEY
jwt.expiration=86400000  # 24 hours in milliseconds
```

### Environment Variables (Docker)

You can override properties using environment variables:
```yaml
environment:
  - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/task_management_db
  - SPRING_DATASOURCE_USERNAME=root
  - SPRING_DATASOURCE_PASSWORD=root
```

## 🐛 Troubleshooting

### Port 8080 already in use
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change the port in application.properties
server.port=8081
```

### MySQL connection refused
```bash
# Check if MySQL is running
docker ps | grep mysql

# Check logs
docker-compose logs mysql

# Restart services
docker-compose restart
```

### Application won't start
```bash
# Check logs
docker-compose logs app

# Common issues:
# 1. MySQL not ready - wait 15-20 seconds
# 2. Port conflict - change port in application.properties
# 3. Database credentials - verify in application.properties
```

## 📈 Performance Considerations

- **Database Indexing**: Indexes on username, email, status, priority
- **Lazy Loading**: Relations use LAZY fetch to avoid N+1 queries
- **Connection Pooling**: Configured via Spring Boot defaults
- **Stateless Auth**: JWT eliminates server-side session storage

## 🔄 Development Workflow

1. **Make changes** to Java files
2. **Rebuild**: `mvn clean install`
3. **Restart**: `docker-compose restart app` or `mvn spring-boot:run`
4. **Test**: Use Postman, cURL, or test script

### Hot Reload (Optional)
Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

## 📚 Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17 | Programming language |
| Spring Boot | 3.2.0 | Application framework |
| Spring Security | 6.x | Authentication & Authorization |
| Spring Data JPA | 3.x | Data persistence |
| MySQL | 8.0 | Database |
| JWT (jjwt) | 0.12.3 | Token generation |
| Lombok | Latest | Reduce boilerplate code |
| Maven | 3.9+ | Build tool |
| Docker | Latest | Containerization |

## 🎯 Next Steps

After getting the basic system running, you can:

1. **Add user roles** (ADMIN, USER, MANAGER)
2. **Implement task comments** and attachments
3. **Add email notifications** for task assignments
4. **Create a frontend** (React, Vue, Angular)
5. **Add search and filtering** capabilities
6. **Implement task history** and audit logs
7. **Add due date reminders** 
8. **Create dashboards** and analytics
9. **Export functionality** (CSV, PDF)
10. **Add task dependencies** and workflows

## 📖 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [JWT.io](https://jwt.io/) - Learn about JWT
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Docker Documentation](https://docs.docker.com/)

## 💡 Tips

- **Change JWT Secret**: Generate a new secret for production
- **Enable HTTPS**: Use SSL/TLS in production
- **Configure CORS**: Restrict origins in production
- **Database Backups**: Set up regular MySQL backups
- **Monitoring**: Add logging and monitoring (ELK, Prometheus)
- **Rate Limiting**: Implement API rate limiting
- **API Versioning**: Consider versioning your API

## 🤝 Contributing

This is a learning/demonstration project. Feel free to:
- Fork and modify
- Add new features
- Report issues
- Submit pull requests

## 📄 License

MIT License - Feel free to use this project for learning or as a foundation for your own applications.

---

**Happy Coding! 🚀**
