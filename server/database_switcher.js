const fs = require('fs');
const { exec } = require('child_process');

function switchToSQLite() {
    console.log('🔄 Switching to SQLite + Prisma Studio...');
    
    // Update .env
    const sqliteConfig = `DATABASE_URL="file:./dev.db"\nPORT=80\n`;
    fs.writeFileSync('.env', sqliteConfig);
    
    // Update schema
    let schema = fs.readFileSync('./prisma/schema.prisma', 'utf-8');
    schema = schema.replace(/provider = "postgresql"/, 'provider = "sqlite"');
    fs.writeFileSync('./prisma/schema.prisma', schema);
    
    console.log('✅ Switched to SQLite');
    console.log('🔗 Access via Prisma Studio: http://localhost:5555');
    console.log('💡 Run: npx prisma studio');
}

function switchToPostgreSQL() {
    console.log('🔄 Switching to PostgreSQL + pgAdmin...');
    
    // Update .env
    const postgresConfig = `DATABASE_URL="postgresql://siddharthchaubal@localhost:5432/taskflow_db"\nPORT=80\n`;
    fs.writeFileSync('.env', postgresConfig);
    
    // Update schema
    let schema = fs.readFileSync('./prisma/schema.prisma', 'utf-8');
    schema = schema.replace(/provider = "sqlite"/, 'provider = "postgresql"');
    fs.writeFileSync('./prisma/schema.prisma', schema);
    
    console.log('✅ Switched to PostgreSQL');
    console.log('🔗 Access via pgAdmin 4:');
    console.log('   Host: localhost');
    console.log('   Port: 5432');
    console.log('   Database: taskflow_db');
    console.log('   Username: siddharthchaubal');
    console.log('   Password: (your system password)');
}

function switchToAWSRDS() {
    console.log('🔄 Switching to AWS RDS PostgreSQL...');
    console.log('⚠️  Please update your .env file with AWS RDS credentials first!');
    
    // Update schema to PostgreSQL (if not already)
    let schema = fs.readFileSync('./prisma/schema.prisma', 'utf-8');
    if (schema.includes('provider = "sqlite"')) {
        schema = schema.replace(/provider = "sqlite"/, 'provider = "postgresql"');
        fs.writeFileSync('./prisma/schema.prisma', schema);
    }
    
    console.log('✅ Schema updated for PostgreSQL');
    console.log('📋 Next steps:');
    console.log('   1. Update .env file with your AWS RDS DATABASE_URL');
    console.log('   2. Run: npm install');
    console.log('   3. Run: npx prisma generate');
    console.log('   4. Run: npx prisma migrate deploy');
    console.log('   5. Run: npm start');
    console.log('');
    console.log('🔗 AWS RDS URL format:');
    console.log('   DATABASE_URL="postgresql://username:password@endpoint:5432/database?sslmode=require"');
}

const mode = process.argv[2];
if (mode === 'sqlite') {
    switchToSQLite();
} else if (mode === 'postgres') {
    switchToPostgreSQL();
} else if (mode === 'aws') {
    switchToAWSRDS();
} else {
    console.log('🎯 Database Switcher Usage:');
    console.log('   node database_switcher.js sqlite    # Use SQLite + Prisma Studio');
    console.log('   node database_switcher.js postgres  # Use PostgreSQL + pgAdmin');
    console.log('   node database_switcher.js aws       # Use AWS RDS PostgreSQL');
    console.log('');
    console.log('📊 Current Status:');
    console.log('   SQLite: ✅ Working with all your data');
    console.log('   PostgreSQL: ⚠️  Needs authentication setup');
    console.log('   AWS RDS: ⚠️  Needs AWS setup and credentials');
    console.log('   Prisma Studio: ✅ Ready at http://localhost:5555');
}
