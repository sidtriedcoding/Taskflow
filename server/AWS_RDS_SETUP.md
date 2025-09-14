# AWS RDS PostgreSQL Setup Guide

## Environment Configuration

Update your `.env` file in the server directory with the following configuration:

```bash
# AWS RDS PostgreSQL Configuration
DATABASE_URL="postgresql://username:password@your-rds-endpoint.amazonaws.com:5432/taskflow_db?sslmode=require"

# Server Configuration
PORT=80

# Optional: Add other environment variables for production
CLIENT_URL="https://your-frontend-domain.com"
NODE_ENV="production"
```

## AWS RDS PostgreSQL URL Format

Your DATABASE_URL should follow this format:
```
postgresql://[username]:[password]@[endpoint]:[port]/[database_name]?sslmode=require
```

### Example:
```
DATABASE_URL="postgresql://taskflow_user:your_secure_password@taskflow-db.cluster-xyz.us-east-1.rds.amazonaws.com:5432/taskflow_db?sslmode=require"
```

## Required Components:

1. **username**: Your RDS master username
2. **password**: Your RDS master password
3. **endpoint**: Your RDS endpoint (found in AWS Console)
4. **port**: Usually 5432 for PostgreSQL
5. **database_name**: The database name you created in RDS
6. **sslmode=require**: Ensures encrypted connection

## Steps to Deploy:

1. Create AWS RDS PostgreSQL instance
2. Update the .env file with your RDS credentials
3. Install PostgreSQL dependencies: `npm install`
4. Run database migrations: `npx prisma migrate deploy`
5. Generate Prisma client: `npx prisma generate`
6. Start your server: `npm start`

## Port Configuration Notes:

**Important**: The server is configured to run on port 80 for HTTP compatibility.
- For local development, the server will use port 80 by default
- For production deployment, ensure your load balancer/nginx is configured to proxy to port 80
- The client is configured to connect to `http://localhost:80/api` by default

## Security Notes:

- Never commit your .env file to version control
- Use strong passwords for your RDS instance
- Configure security groups to allow connections only from your EC2 instance
- Enable encryption in transit and at rest
