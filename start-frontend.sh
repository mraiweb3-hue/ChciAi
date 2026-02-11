#!/bin/bash

# Start Frontend Script for ChciAI.cz

echo "🚀 Starting ChciAI Frontend..."

# Check if .env exists
if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Warning: frontend/.env not found!"
    echo "📋 Creating from template..."
    cp frontend/.env.template frontend/.env
    echo "✅ Created frontend/.env (edit if needed)"
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies with yarn..."
    yarn install
fi

echo "✅ Dependencies installed"

# Start development server
echo "🎯 Starting React development server..."
echo "📍 Frontend will be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

yarn start
