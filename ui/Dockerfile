# Use Node.js 20 as the base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose the port Vite runs on
EXPOSE 5173

# Default command (can be overridden in docker-compose.yaml)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
