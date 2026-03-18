#!/bin/bash

# Setup script for ESP32 Thermostat Multi-User System

echo "🚀 Setting up ESP32 Thermostat Multi-User System..."
echo ""

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo ""
echo "🗄️  Initializing database..."
npm run init-db

echo ""
echo "✅ Backend setup complete!"
echo ""

# Instructions
echo "📋 Next steps:"
echo ""
echo "1. Configure backend/.env with your settings"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd frontend && python -m http.server 8080"
echo "4. Open http://localhost:8080 in your browser"
echo ""
echo "🎉 Setup complete! Happy coding!"
