# Use Node.js 18 (LTS)
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Build the application
RUN npm run build

# Expose port 8080 (Cloud Run default)
ENV PORT=8080
ENV HOST=0.0.0.0
EXPOSE 8080

# Start the application
CMD ["node", ".output/server/index.mjs"]
