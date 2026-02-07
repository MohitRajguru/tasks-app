# Quick Start Guide

This guide will help you get the Task Management System up and running in 5 minutes.

## Prerequisites Check

Before starting, ensure you have:
- [ ] Java 17+ installed (`java -version`)
- [ ] Maven 3.6+ installed (`mvn -version`)
- [ ] Docker installed (optional, for easy MySQL setup)

## Step 1: Start MySQL Database

### Using Docker (Recommended)
```bash
cd task-management-system
docker-compose up -d
```

Wait 10-15 seconds for MySQL to fully start.

### Without Docker
Install MySQL 8.0+ and run:
```sql
CREATE DATABASE task_management_db;
```

## Step 2: Build the Application

```bash
mvn clean install
```

## Step 3: Run the Application

```bash
mvn spring-boot:run
```

You should see:
```
Started TaskManagementApplication in X.XXX seconds
```

The API is now running at `http://localhost:8080`

## Step 4: Test the API

### Test 1: Register a User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

You should receive a response with a JWT token. **Copy the token value!**

### Test 2: Create a Task

Replace `YOUR_TOKEN_HERE` with the token from the previous response:

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Task",
    "description": "Testing the task API",
    "status": "NEW",
    "priority": "MEDIUM",
    "dueDate": "2026-02-20"
  }'
```

### Test 3: Get All Tasks

```bash
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Step 5: Import Postman Collection (Optional)

1. Open Postman
2. Click "Import"
3. Select `Task-Management-API.postman_collection.json`
4. Update the `jwt_token` variable with your token
5. Test all endpoints easily!

## Common Issues

### Port 8080 Already in Use
Change the port in `application.properties`:
```properties
server.port=8081
```

### MySQL Connection Failed
Check if MySQL is running:
```bash
docker ps  # For Docker
# or
mysql -u root -p  # For local MySQL
```

### JWT Token Expired
Tokens expire after 24 hours. Simply login again to get a new token.

## Next Steps

- Read the full [README.md](README.md) for detailed API documentation
- Explore all endpoints using Postman collection
- Check `application.properties` for configuration options
- Review the source code to understand the architecture

## Support

For issues or questions:
1. Check the README.md
2. Review application logs
3. Verify database connection
4. Ensure all prerequisites are met

Happy coding! 🚀
