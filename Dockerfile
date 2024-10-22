# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy prisma directory (including schema.prisma)
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Copy only the necessary directories and files
# COPY src ./src
# COPY middleware ./middleware


# Build the Next.js app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Create a directory for logs
RUN mkdir -p /app/logs

# Create directories for logs and uploads
RUN mkdir -p /app/logs \
    && mkdir -p /app/public/uploads/users \
    && mkdir -p /app/public/uploads/plants \
    && mkdir -p /app/public/uploads/userplants \
    && mkdir -p /app/public/uploads/plant-icons \
    && mkdir -p /app/public/uploads/articles \
    && mkdir -p /app/public/uploads/trades \
    && mkdir -p /app/public/uploads/icon/ 
# load or save /plantID/ but not sure if everything is correctly set up

# Set permissions for the logs and uploads directories
RUN chmod -R 755 /app/logs /app/public/uploads

CMD ["npm", "start"]