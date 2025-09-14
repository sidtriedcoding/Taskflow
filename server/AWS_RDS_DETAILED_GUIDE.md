# Complete AWS RDS PostgreSQL Setup Guide

## 1. Create AWS RDS PostgreSQL Instance

### Step 1: Access AWS RDS Console
1. Log into your AWS Management Console
2. Navigate to RDS service
3. Click "Create database"

### Step 2: Database Configuration
- **Engine type**: PostgreSQL
- **Version**: PostgreSQL 15.x or 16.x (recommended)
- **Templates**: 
  - For production: Production
  - For testing: Free tier

### Step 3: Settings
- **DB instance identifier**: `taskflow-db` (or your preferred name)
- **Master username**: `taskflow_admin` (or your preferred username)
- **Master password**: Create a strong password (save this!)

### Step 4: Instance Configuration
- **DB instance class**: 
  - Free tier: `db.t3.micro`
  - Production: `db.t3.small` or larger
- **Storage**: 
  - Type: General Purpose SSD (gp2)
  - Size: 20 GB minimum

### Step 5: Connectivity
- **VPC**: Default VPC (or your custom VPC)
- **Subnet group**: Default
- **Public access**: Yes (for initial setup)
- **VPC security groups**: Create new or use existing
- **Database port**: 5432

### Step 6: Database Authentication
- **Database authentication**: Password authentication

### Step 7: Additional Configuration
- **Initial database name**: `taskflow_db`
- **Backup retention**: 7 days (production)
- **Monitoring**: Enable Enhanced monitoring (optional)

## 2. Configure Security Groups

### Create Security Group Rules:
1. Go to EC2 → Security Groups
2. Find your RDS security group
3. Add inbound rules:
   - **Type**: PostgreSQL
   - **Port**: 5432
   - **Source**: Your EC2 instance security group or specific IP

## 3. Get Connection Details

After creating the RDS instance:
1. Go to RDS → Databases
2. Click on your database instance
3. Note the **Endpoint** and **Port**
4. Use the **Master username** and password you set

## 4. Update Your .env File

Replace the values in your `.env` file:

```bash
DATABASE_URL="postgresql://taskflow_admin:your_password@taskflow-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com:5432/taskflow_db?sslmode=require"
PORT=80
NODE_ENV="production"
```

## 5. Install Dependencies and Deploy

```bash
# Install PostgreSQL driver
npm install

# Generate Prisma client
npx prisma generate

# Deploy database schema
npx prisma migrate deploy

# Seed the database (optional)
npx prisma db seed
```

## 6. Test Connection

```bash
# Test the connection
npx prisma studio
```

## 7. Production Considerations

### Environment Variables for Production:
```bash
DATABASE_URL="postgresql://username:password@endpoint:5432/database?sslmode=require"
PORT=80
NODE_ENV="production"
CLIENT_URL="https://your-domain.com"
```

### Port 80 Configuration:
**Important**: The server has been configured to run on port 80 for HTTP compatibility.
- Port 80 is the standard HTTP port and doesn't require specifying the port in URLs
- For AWS EC2 deployment, ensure your security groups allow inbound traffic on port 80
- The client automatically connects to the server on port 80
- If using a load balancer, configure it to forward traffic to port 80 on your EC2 instance

### Security Best Practices:
1. **Never expose credentials** in your code
2. **Use environment variables** for all sensitive data
3. **Enable encryption** in transit and at rest
4. **Configure proper security groups**
5. **Regular backups** and monitoring
6. **Use connection pooling** for production

### Cost Optimization:
1. **Stop RDS instances** when not in use (dev/test)
2. **Use appropriate instance sizes**
3. **Monitor usage** with CloudWatch
4. **Set up billing alerts**

## 8. Troubleshooting

### Common Issues:
1. **Connection timeout**: Check security groups
2. **Authentication failed**: Verify username/password
3. **SSL required**: Add `?sslmode=require` to URL
4. **Database not found**: Ensure initial database name matches

### Useful Commands:
```bash
# Check Prisma connection
npx prisma db pull

# Reset database
npx prisma migrate reset

# View database schema
npx prisma studio
```

## 9. Migration from SQLite to PostgreSQL

Since you're migrating from SQLite:
1. **Backup your SQLite data** first
2. **Run migrations** to create PostgreSQL schema
3. **Migrate data** using Prisma's data migration tools
4. **Test thoroughly** before going live

## 10. Monitoring and Maintenance

Set up:
1. **CloudWatch alarms** for CPU, memory, connections
2. **Automated backups**
3. **Performance monitoring**
4. **Log monitoring** for errors
