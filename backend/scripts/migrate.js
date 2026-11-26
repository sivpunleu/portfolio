const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pool = require('../config/db');

const ensureDatabaseExists = async () => {
    try {
        await pool.query('SELECT 1');
    } catch (error) {
        if (error.code !== 'ER_BAD_DB_ERROR') throw error;
        const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE;
        if (!dbName || !/^[a-zA-Z0-9_]+$/.test(dbName)) {
            throw new Error('Invalid or missing DB_NAME');
        }
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST || process.env.MYSQLHOST,
            user: process.env.DB_USER || process.env.MYSQLUSER,
            password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
            port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
            ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {}),
        });
        try {
            await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
            console.log(`✅ Database ${dbName} ready`);
        } finally {
            await conn.end();
        }
    }
};

const ensureUserColumn = async (name, definition) => {
    const [columns] = await pool.query('SHOW COLUMNS FROM users LIKE ?', [name]);
    if (columns.length === 0) {
        await pool.query(`ALTER TABLE users ADD COLUMN ${definition}`);
        console.log(`✅ Column ${name} added to users`);
    }
};

const ensureIndex = async (tableName, indexName, columnDefinition) => {
    const [indexes] = await pool.query(
        `SHOW INDEX FROM ${tableName} WHERE Key_name = ?`,
        [indexName]
    );
    if (indexes.length === 0) {
        await pool.query(`ALTER TABLE ${tableName} ADD INDEX ${indexName} (${columnDefinition})`);
        console.log(`✅ Index ${indexName} added to ${tableName}`);
    }
};

const ensureEmailIsUnique = async () => {
    const [indexes] = await pool.query(
        'SHOW INDEX FROM users WHERE Column_name = ? AND Non_unique = 0',
        ['email'],
    );
    if (indexes.length === 0) {
        await pool.query('ALTER TABLE users ADD UNIQUE INDEX users_email_unique (email)');
        console.log('✅ Unique index on email added to users');
    }
};

const migrate = async () => {
    try {
        console.log('🔄 Running migration...');
        await ensureDatabaseExists();

        // ==============================
        // TABLE 1: personal_info
        // ==============================
        await pool.query(`
            CREATE TABLE IF NOT EXISTS personal_info (
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                title VARCHAR(100) NOT NULL,
                bio TEXT NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20) NULL,
                location VARCHAR(100) NULL,
                avatar_url VARCHAR(255) NULL,
                resume_url VARCHAR(255) NULL,
                github_url VARCHAR(255) NULL,
                linkedin_url VARCHAR(255) NULL,
                twitter_url VARCHAR(255) NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table personal_info ready');

        // Seed personal_info if empty
        const [profileRows] = await pool.query('SELECT COUNT(*) as count FROM personal_info');
        if (profileRows[0].count === 0) {
            await pool.query(`
                INSERT INTO personal_info 
                (full_name, title, bio, email, phone, location, avatar_url, resume_url, github_url, linkedin_url, twitter_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                'Siv Punleu',
                'Full Stack Developer',
                'ខ្ញុំជា Developer ដែលចូលចិត្តបង្កើត Web Application ដោយប្រើ Vue.js, Node.js និង MySQL...',
                'sivpunleu174.email@gmail.com',
                '0969596217',
                'Phnom Penh, Cambodia',
                null,
                null,
                'https://github.com/yourusername',
                'https://linkedin.com/in/yourusername',
                null
            ]);
            console.log('✅ personal_info seeded');
        } else {
            console.log('ℹ️  personal_info already has data, skipping seed');
        }

        // ==============================
        // TABLE 2: users
        // ==============================
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) NOT NULL UNIQUE,
                full_name VARCHAR(100) NOT NULL,
                phone VARCHAR(20) NULL,
                role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
                password VARCHAR(255) NOT NULL,
                token CHAR(64) NULL,
                is_verified TINYINT(1) NOT NULL DEFAULT 0,
                verification_token CHAR(64) NULL,
                verification_expires DATETIME NULL,
                reset_password_token CHAR(64) NULL,
                reset_password_expires DATETIME NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table users ready');

        // Column updates and indexes on users
        await ensureUserColumn('full_name', "full_name VARCHAR(100) NOT NULL DEFAULT ''");
        await ensureUserColumn('phone', 'phone VARCHAR(20) NULL');

        const [roleColumns] = await pool.query("SHOW COLUMNS FROM users LIKE 'role'");
        if (roleColumns.length === 0) {
            await pool.query("ALTER TABLE users ADD COLUMN role ENUM('admin', 'user') NOT NULL DEFAULT 'user' AFTER phone");
            // Existing accounts created prior to RBAC migration belong to the portfolio admin(s)
            await pool.query("UPDATE users SET role = 'admin'");
            console.log('✅ Column role added to users and existing users promoted to admin');
        }

        await ensureUserColumn('token', 'token CHAR(64) NULL');
        await ensureUserColumn('is_verified', 'is_verified TINYINT(1) NOT NULL DEFAULT 0');
        await ensureUserColumn('verification_token', 'verification_token CHAR(64) NULL');
        await ensureUserColumn('verification_expires', 'verification_expires DATETIME NULL');
        await ensureUserColumn('reset_password_token', 'reset_password_token CHAR(64) NULL');
        await ensureUserColumn('reset_password_expires', 'reset_password_expires DATETIME NULL');
        await ensureEmailIsUnique();
        await ensureIndex('users', 'idx_users_token', 'token');
        await ensureIndex('users', 'idx_users_verification_token', 'verification_token');
        await ensureIndex('users', 'idx_users_reset_password_token', 'reset_password_token');

        // ==============================
        // TABLE 3: education
        // ==============================
        await pool.query(`
            CREATE TABLE IF NOT EXISTS education (
                id INT AUTO_INCREMENT PRIMARY KEY,
                school_name VARCHAR(150) NOT NULL,
                degree VARCHAR(150) NOT NULL,
                field_of_study VARCHAR(100) NULL,
                start_date DATE NOT NULL,
                end_date DATE NULL,
                grade VARCHAR(20) NULL,
                description TEXT NULL,
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table education ready');

        // ==============================
        // TABLE 4: projects
        // ==============================
        await pool.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(150) NOT NULL,
                slug VARCHAR(160) NOT NULL UNIQUE,
                description TEXT NOT NULL,
                thumbnail_url VARCHAR(255) NULL,
                tech_stack JSON NULL,
                live_url VARCHAR(255) NULL,
                github_url VARCHAR(255) NULL,
                is_featured TINYINT(1) DEFAULT 0,
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table projects ready');

        // Seed projects if empty
        const [projectRows] = await pool.query('SELECT COUNT(*) as count FROM projects');
        if (projectRows[0].count === 0) {
            await pool.query(`
                INSERT INTO projects
                (title, slug, description, thumbnail_url, tech_stack, live_url, github_url, is_featured, display_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                'Modern Developer Portfolio',
                'modern-developer-portfolio',
                'Full-Stack Portfolio Application built with Node.js, Express, Vue.js, and MySQL with complete CMS Dashboard.',
                'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
                JSON.stringify(['Vue.js', 'Node.js', 'Express', 'MySQL', 'JWT']),
                'https://example.com',
                'https://github.com/yourusername/portfolio',
                1,
                1
            ]);

            await pool.query(`
                INSERT INTO projects
                (title, slug, description, thumbnail_url, tech_stack, live_url, github_url, is_featured, display_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                'E-Commerce RESTful API',
                'ecommerce-restful-api',
                'High-performance RESTful API for modern e-commerce platform with authentication, orders, and payment integrations.',
                'https://images.unsplash.com/photo-1557821552-17105176677c?w=800',
                JSON.stringify(['Node.js', 'Express', 'MySQL', 'Redis', 'Stripe']),
                null,
                'https://github.com/yourusername/ecommerce-api',
                1,
                2
            ]);
            console.log('✅ projects seeded');
        } else {
            console.log('ℹ️  projects already has data, skipping seed');
        }

        // ==============================
        // TABLE 5: skills
        // ==============================
        await pool.query(`
            CREATE TABLE IF NOT EXISTS skills (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                category ENUM('Frontend', 'Backend', 'Database', 'Tools', 'DevOps', 'Other') DEFAULT 'Other',
                proficiency_percent INT NULL,
                icon_url VARCHAR(255) NULL,
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table skills ready');
        await ensureIndex('skills', 'idx_skills_category', 'category');

        // Seed skills if empty
        const [skillRows] = await pool.query('SELECT COUNT(*) as count FROM skills');
        if (skillRows[0].count === 0) {
            const initialSkills = [
                ['Vue.js', 'Frontend', 90, 'vuejs', 1],
                ['JavaScript (ES6+)', 'Frontend', 95, 'javascript', 2],
                ['HTML5 & CSS3', 'Frontend', 90, 'html5', 3],
                ['Node.js', 'Backend', 92, 'nodedotjs', 4],
                ['Express.js', 'Backend', 90, 'express', 5],
                ['RESTful APIs', 'Backend', 95, 'fastapi', 6],
                ['MySQL', 'Database', 88, 'mysql', 7],
                ['Git & GitHub', 'Tools', 90, 'git', 8],
                ['Postman', 'Tools', 88, 'postman', 9],
            ];

            for (const [name, cat, prof, icon, order] of initialSkills) {
                await pool.query(`
                    INSERT INTO skills (name, category, proficiency_percent, icon_url, display_order)
                    VALUES (?, ?, ?, ?, ?)
                `, [name, cat, prof, icon, order]);
            }
            console.log('✅ skills seeded');
        } else {
            console.log('ℹ️  skills already has data, skipping seed');
        }

        // ==============================
        // TABLE 6: contact_messages
        // ==============================
        await pool.query(`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sender_name VARCHAR(100) NOT NULL,
                sender_email VARCHAR(100) NOT NULL,
                subject VARCHAR(200) NOT NULL,
                message TEXT NOT NULL,
                is_read TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table contact_messages ready');
        await ensureIndex('contact_messages', 'idx_contact_is_read', 'is_read');

        console.log('\n🎉 Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
};

migrate();
