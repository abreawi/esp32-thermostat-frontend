#!/bin/bash

# Development startup script

echo "🚀 Starting ESP32 Thermostat System in development mode..."
echo ""

# Start backend in background
echo "🔧 Starting backend..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🌐 Starting frontend..."
cd ../frontend
python -m http.server 8080 &
FRONTEND_PID=$!

echo ""
echo "✅ System started!"
echo ""
echo "📡 Backend: http://localhost:3000"
echo "🌐 Frontend: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; echo 'Stopping services...'; exit" INT
wait
