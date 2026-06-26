FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies required for librosa and audio processing
RUN apt-get update && apt-get install -y \
    libsndfile1 \
    ffmpeg \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Start the application using Uvicorn (since main.py uses uvicorn.run internally, or we can run uvicorn directly)
# main.py usually handles routing, but running it natively is fine
CMD ["python", "main.py"]
