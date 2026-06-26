FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
