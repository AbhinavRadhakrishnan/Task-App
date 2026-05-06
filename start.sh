#!/bin/bash
echo "Installing Backend Dependencies..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

echo "Starting Backend..."
uvicorn main:app --host 0.0.0.0 --port 8000 &

echo "Installing Frontend Dependencies..."
cd ../frontend
npm install

echo "Starting Frontend..."
npm run dev
