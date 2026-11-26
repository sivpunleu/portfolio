-- create database my_portfolio;
use my_portfolio;

-- 1. Personal Info / About Me Table (Single Record Design)
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
);

-- 2. Admin Users Table
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_token (token),
  INDEX idx_users_verification_token (verification_token),
  INDEX idx_users_reset_password_token (reset_password_token)
);

-- 3. Education Table
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
);

-- 4. Projects Table
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
);

-- 5. Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category ENUM('Frontend', 'Backend', 'Database', 'Tools', 'DevOps', 'Other') DEFAULT 'Other',
  proficiency_percent INT NULL,
  icon_url VARCHAR(255) NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_skills_category (category)
);

-- 6. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_name VARCHAR(100) NOT NULL,
  sender_email VARCHAR(100) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_is_read (is_read)
);
