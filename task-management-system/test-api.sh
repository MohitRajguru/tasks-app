#!/bin/bash

# API Testing Script for Task Management System

BASE_URL="http://localhost:8080/api"
TOKEN=""

echo "======================================"
echo "Task Management System - API Test"
echo "======================================"
echo ""

# Test 1: Register a user
echo "📝 Test 1: Registering a new user..."
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123",
    "fullName": "Test User"
  }')

echo "Response: $REGISTER_RESPONSE"

# Extract token
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Registration failed!"
    echo ""
    
    # Try login instead
    echo "📝 Attempting login with existing user..."
    LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "username": "testuser",
        "password": "test123"
      }')
    
    echo "Response: $LOGIN_RESPONSE"
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
    echo "❌ Failed to get authentication token!"
    exit 1
fi

echo "✅ Authentication successful!"
echo "Token: ${TOKEN:0:20}..."
echo ""

# Test 2: Create a task
echo "📝 Test 2: Creating a new task..."
CREATE_RESPONSE=$(curl -s -X POST "${BASE_URL}/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task created via API",
    "status": "NEW",
    "priority": "HIGH",
    "dueDate": "2026-03-01"
  }')

echo "Response: $CREATE_RESPONSE"
TASK_ID=$(echo $CREATE_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ ! -z "$TASK_ID" ]; then
    echo "✅ Task created successfully! ID: $TASK_ID"
else
    echo "❌ Task creation failed!"
fi
echo ""

# Test 3: Get all tasks
echo "📝 Test 3: Fetching all tasks..."
GET_ALL_RESPONSE=$(curl -s -X GET "${BASE_URL}/tasks" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $GET_ALL_RESPONSE"
echo "✅ Fetch completed!"
echo ""

# Test 4: Get task by ID
if [ ! -z "$TASK_ID" ]; then
    echo "📝 Test 4: Fetching task by ID..."
    GET_ONE_RESPONSE=$(curl -s -X GET "${BASE_URL}/tasks/${TASK_ID}" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "Response: $GET_ONE_RESPONSE"
    echo "✅ Fetch completed!"
    echo ""
fi

# Test 5: Update task
if [ ! -z "$TASK_ID" ]; then
    echo "📝 Test 5: Updating task..."
    UPDATE_RESPONSE=$(curl -s -X PUT "${BASE_URL}/tasks/${TASK_ID}" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "title": "Updated Test Task",
        "description": "This task has been updated",
        "status": "IN_PROGRESS",
        "priority": "CRITICAL",
        "dueDate": "2026-02-28"
      }')
    
    echo "Response: $UPDATE_RESPONSE"
    echo "✅ Update completed!"
    echo ""
fi

# Test 6: Delete task
if [ ! -z "$TASK_ID" ]; then
    echo "📝 Test 6: Deleting task..."
    DELETE_RESPONSE=$(curl -s -X DELETE "${BASE_URL}/tasks/${TASK_ID}" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "Response: $DELETE_RESPONSE"
    echo "✅ Delete completed!"
    echo ""
fi

echo "======================================"
echo "✅ All API tests completed!"
echo "======================================"
