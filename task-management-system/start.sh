#!/bin/bash

# Task Management System - Quick Start Script

echo "======================================"
echo "Task Management System - Quick Start"
echo "======================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Stop and remove existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down -v 2>/dev/null

# Start services
echo "🚀 Starting Task Management System..."
docker-compose up -d

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
sleep 15

# Check if services are running
if [ "$(docker ps -q -f name=task-management-mysql)" ]; then
    echo "✅ MySQL is running"
else
    echo "❌ MySQL failed to start"
    docker-compose logs mysql
    exit 1
fi

if [ "$(docker ps -q -f name=task-management-app)" ]; then
    echo "✅ Application is running"
else
    echo "❌ Application failed to start"
    docker-compose logs app
    exit 1
fi

echo ""
echo "======================================"
echo "✅ Task Management System is ready!"
echo "======================================"
echo ""
echo "📍 API Base URL: http://localhost:8080/api"
echo ""
echo "📝 Quick Test Commands:"
echo ""
echo "1. Register a user:"
echo "   curl -X POST http://localhost:8080/api/auth/register \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"username\":\"john\",\"email\":\"john@example.com\",\"password\":\"pass123\",\"fullName\":\"John Doe\"}'"
echo ""
echo "2. Login:"
echo "   curl -X POST http://localhost:8080/api/auth/login \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"username\":\"john\",\"password\":\"pass123\"}'"
echo ""
echo "📊 View logs:"
echo "   docker-compose logs -f app"
echo ""
echo "🛑 Stop the application:"
echo "   docker-compose down"
echo ""
