#!/bin/bash

# Start Backend Script for ChciAI.cz

echo "🚀 Starting ChciAI Backend..."

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: backend/.env not found!"
    echo "📋 Create it from template:"
    echo "   cp backend/.env.template backend/.env"
    echo "   then edit backend/.env with your values"
    exit 1
fi

# Check if MongoDB is accessible
echo "🔍 Checking MongoDB connection..."
source backend/.env
if [ -z "$MONGO_URL" ]; then
    echo "⚠️  Warning: MONGO_URL not set in .env"
fi

# Check if LLM key is set
if [ -z "$EMERGENT_LLM_KEY" ]; then
    echo "⚠️  Warning: EMERGENT_LLM_KEY not set in .env"
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt

echo "✅ Dependencies installed"

# Start server
echo "🎯 Starting FastAPI server on port 8000..."
echo "📍 API will be available at: http://localhost:8000/api/"
echo "📖 Docs available at: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop"
echo ""

uvicorn server:app --host 0.0.0.0 --port 8000 --reload
