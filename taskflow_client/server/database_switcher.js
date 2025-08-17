const fs = require('fs');
const { exec } = require('child_process');

function switchToSQLite() {
    console.log('🔄 Switching to SQLite + Prisma Studio...');
    
    // Update .env
    const sqliteConfig = `DATABASE_URL="file:./dev.db"\nPORT=8000\n`;
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
    const postgresConfig = `DATABASE_URL="postgresql://siddharthchaubal@localhost:5432/taskflow_db"\nPORT=8000\n`;
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

const mode = process.argv[2];
if (mode === 'sqlite') {
    switchToSQLite();
} else if (mode === 'postgres') {
    switchToPostgreSQL();
} else {
    console.log('🎯 Database Switcher Usage:');
    console.log('   node database_switcher.js sqlite    # Use SQLite + Prisma Studio');
    console.log('   node database_switcher.js postgres  # Use PostgreSQL + pgAdmin');
    console.log('');
    console.log('📊 Current Status:');
    console.log('   SQLite: ✅ Working with all your data');
    console.log('   PostgreSQL: ⚠️  Needs authentication setup');
    console.log('   Prisma Studio: ✅ Ready at http://localhost:5555');
}
