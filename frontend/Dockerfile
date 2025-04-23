FROM node:18-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

EXPOSE 3000

CMD ["npm", "start"] 