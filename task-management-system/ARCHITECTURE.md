# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  (Postman, cURL, Frontend App, Mobile App, etc.)            │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/REST + JWT Token
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    SPRING BOOT APPLICATION                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           SECURITY FILTER CHAIN                        │ │
│  │  - JwtAuthenticationFilter (validates JWT)             │ │
│  │  - Spring Security Config                              │ │
│  └────────────────────┬───────────────────────────────────┘ │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────────┐ │
│  │              CONTROLLER LAYER                          │ │
│  │  - AuthController (/api/auth/*)                        │ │
│  │  - TaskController (/api/tasks/*)                       │ │
│  └────────────────────┬───────────────────────────────────┘ │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────────┐ │
│  │              SERVICE LAYER                             │ │
│  │  - AuthService (registration, login, JWT)              │ │
│  │  - TaskService (CRUD operations, validation)           │ │
│  └────────────────────┬───────────────────────────────────┘ │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────────┐ │
│  │            REPOSITORY LAYER                            │ │
│  │  - UserRepository (JPA)                                │ │
│  │  - TaskRepository (JPA)                                │ │
│  └────────────────────┬───────────────────────────────────┘ │
│                       │                                      │
└───────────────────────┼──────────────────────────────────────┘
                        │ JDBC
                        │
┌───────────────────────▼──────────────────────────────────────┐
│                    MySQL DATABASE                            │
│  - users table                                               │
│  - tasks table                                               │
└──────────────────────────────────────────────────────────────┘
```

## Request Flow

### Authentication Flow (Register/Login)

```
1. Client → POST /api/auth/register
           ↓
2. AuthController.register()
           ↓
3. AuthService.register()
   - Validate user data
   - Hash password (BCrypt)
   - Save to UserRepository
           ↓
4. UserRepository.save() → MySQL
           ↓
5. Generate JWT token
           ↓
6. Return AuthResponse with token
           ↓
7. Client stores token
```

### Task CRUD Flow (Protected Endpoints)

```
1. Client → POST /api/tasks + Authorization: Bearer TOKEN
           ↓
2. JwtAuthenticationFilter
   - Extract token from header
   - Validate token
   - Load user details
   - Set authentication in SecurityContext
           ↓
3. TaskController.createTask()
           ↓
4. TaskService.createTask()
   - Get current user from SecurityContext
   - Validate task data
   - Set creator
   - Set assignee (if provided)
   - Save to TaskRepository
           ↓
5. TaskRepository.save() → MySQL
           ↓
6. Map to TaskResponse
           ↓
7. Return TaskResponse to client
```

## Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         MODELS                               │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────────┐  │
│  │   User   │    │   Task   │    │ TaskStatus (enum)    │  │
│  │          │    │          │    │ TaskPriority (enum)  │  │
│  │ - id     │◄───│ - id     │    └──────────────────────┘  │
│  │ - username│   │ - title  │                              │
│  │ - email  │    │ - status │                              │
│  │ - password│   │ - priority│                             │
│  └──────────┘    │ - creator│                              │
│                  │ - assignee│                             │
│                  └──────────┘                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                          DTOs                                │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ LoginRequest  │  │RegisterRequest│  │ AuthResponse    │  │
│  └───────────────┘  └──────────────┘  └─────────────────┘  │
│  ┌───────────────┐  ┌──────────────┐                       │
│  │ TaskRequest   │  │TaskResponse  │                       │
│  └───────────────┘  └──────────────┘                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        SECURITY                              │
│  ┌─────────────────────┐  ┌──────────────────────────────┐ │
│  │ JwtTokenProvider    │  │ JwtAuthenticationFilter      │ │
│  │ - generateToken()   │  │ - doFilterInternal()         │ │
│  │ - validateToken()   │  │ - getJwtFromRequest()        │ │
│  │ - getUsernameFromToken()│                             │ │
│  └─────────────────────┘  └──────────────────────────────┘ │
│  ┌─────────────────────┐  ┌──────────────────────────────┐ │
│  │ SecurityConfig      │  │ UserDetailsServiceImpl       │ │
│  │ - filterChain()     │  │ - loadUserByUsername()       │ │
│  └─────────────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

```
┌─────────────────────────────────────┐
│             users                    │
├─────────────────────────────────────┤
│ PK  id (BIGINT)                     │
│ UQ  username (VARCHAR 50)           │
│ UQ  email (VARCHAR 100)             │
│     password (VARCHAR 255)          │
│     full_name (VARCHAR 100)         │
│     created_date (TIMESTAMP)        │
│     updated_date (TIMESTAMP)        │
└─────────────┬───────────────────────┘
              │
              │ 1:N (created tasks)
              │
┌─────────────▼───────────────────────┐
│             tasks                    │
├─────────────────────────────────────┤
│ PK  id (BIGINT)                     │
│     title (VARCHAR 255)             │
│     description (TEXT)              │
│     status (VARCHAR 50)             │
│     priority (VARCHAR 50)           │
│ FK  assigned_to_id (BIGINT) ────────┼──┐
│ FK  created_by_id (BIGINT)          │  │
│     created_date (TIMESTAMP)        │  │
│     updated_date (TIMESTAMP)        │  │
│     due_date (DATE)                 │  │
└─────────────────────────────────────┘  │
              │                           │
              └───────────────────────────┘
                   N:1 (assigned tasks)
```

## Security Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    JWT AUTHENTICATION                         │
└──────────────────────────────────────────────────────────────┘

Registration/Login:
─────────────────
1. User sends credentials
2. AuthService validates
3. Password hashed with BCrypt
4. User saved to database
5. JWT token generated (expires in 24h)
6. Token returned to client

Subsequent Requests:
───────────────────
1. Client includes: Authorization: Bearer <token>
2. JwtAuthenticationFilter intercepts
3. Token extracted from header
4. Token validated (signature, expiration)
5. Username extracted from token
6. User loaded from database
7. Authentication set in SecurityContext
8. Request proceeds to controller

Token Structure:
───────────────
Header:     { "alg": "HS256", "typ": "JWT" }
Payload:    { "sub": "username", "iat": ..., "exp": ... }
Signature:  HMACSHA256(base64(header) + "." + base64(payload), secret)
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DOCKER DEPLOYMENT                         │
└─────────────────────────────────────────────────────────────┘

Docker Compose Setup:
────────────────────

┌──────────────────────────┐      ┌──────────────────────────┐
│   MySQL Container        │      │   App Container          │
│                          │      │                          │
│ - Image: mysql:8.0       │◄─────┤ - Build: Dockerfile      │
│ - Port: 3306             │      │ - Port: 8080             │
│ - Volume: mysql-data     │      │ - Depends: mysql         │
│ - Network: task-network  │      │ - Network: task-network  │
└──────────────────────────┘      └──────────────────────────┘
           │                                 │
           │                                 │
           └─────────┬───────────────────────┘
                     │
              ┌──────▼──────┐
              │   Bridge    │
              │   Network   │
              └─────────────┘

Multi-Stage Dockerfile:
──────────────────────
Stage 1: Build
- Base: maven:3.9-eclipse-temurin-17
- Copy source code
- Run: mvn clean package

Stage 2: Runtime
- Base: eclipse-temurin:17-jre-alpine
- Copy JAR from build stage
- Expose port 8080
- Run: java -jar app.jar
```

## API Design Patterns

### RESTful Design
```
Resource: Task
─────────────
GET    /api/tasks           → List all tasks
POST   /api/tasks           → Create new task
GET    /api/tasks/{id}      → Get specific task
PUT    /api/tasks/{id}      → Update task
DELETE /api/tasks/{id}      → Delete task

Resource: Authentication
───────────────────────
POST   /api/auth/register   → Register user
POST   /api/auth/login      → Login user
```

### Layer Separation
```
Controller Layer:
- HTTP request/response handling
- Input validation (@Valid)
- Authorization checks
- Returns DTOs (not entities)

Service Layer:
- Business logic
- Transaction management (@Transactional)
- Converts between entities and DTOs
- Enforces business rules

Repository Layer:
- Database operations
- Query methods
- Extends JpaRepository
```

## Error Handling

```
┌──────────────────────────────────────────────────────────────┐
│              GLOBAL EXCEPTION HANDLER                         │
└──────────────────────────────────────────────────────────────┘

@RestControllerAdvice handles:
────────────────────────────

1. ResourceNotFoundException → 404 Not Found
   {
     "timestamp": "2026-02-08T10:30:00",
     "message": "Task not found with id: 123",
     "status": 404
   }

2. MethodArgumentNotValidException → 400 Bad Request
   {
     "timestamp": "2026-02-08T10:30:00",
     "message": "Validation failed",
     "errors": {
       "username": "Username is required",
       "email": "Email should be valid"
     },
     "status": 400
   }

3. General Exception → 500 Internal Server Error
   {
     "timestamp": "2026-02-08T10:30:00",
     "message": "An error occurred",
     "status": 500
   }
```

## Performance Considerations

### Database Optimization
```
Indexing:
- Primary keys (id)
- Unique constraints (username, email)
- Foreign keys (assigned_to_id, created_by_id)
- Status and priority for filtering

Connection Pooling:
- HikariCP (default in Spring Boot)
- Optimized for performance

Lazy Loading:
- Task ↔ User relationships
- Prevents N+1 queries
```

### Security Best Practices
```
Password Security:
- BCrypt with strength 10
- Salted automatically
- Slow by design (prevents brute force)

JWT Security:
- HMAC SHA-256 signature
- Token expiration (24 hours)
- Stateless (scalable)
- Secret key stored in config

API Security:
- All task endpoints require authentication
- Users can only access their own data
- Input validation on all endpoints
```

## Scalability

### Horizontal Scaling
```
┌─────────┐  ┌─────────┐  ┌─────────┐
│ App 1   │  │ App 2   │  │ App 3   │
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     └────────┬───┴────────────┘
              │
      ┌───────▼────────┐
      │ Load Balancer  │
      └───────┬────────┘
              │
      ┌───────▼────────┐
      │  MySQL (HA)    │
      └────────────────┘

Notes:
- Stateless design (JWT)
- No session storage
- Can add multiple app instances
- Shared database
```

---

This architecture provides:
✅ Clear separation of concerns
✅ Scalable design
✅ Security best practices
✅ RESTful API design
✅ Production-ready structure
