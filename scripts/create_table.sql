CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    verified BOOLEAN DEFAULT FALSE,
    username VARCHAR(50) UNIQUE,

    verification_code VARCHAR(10),
    verification_expires TIMESTAMP,

    recovery_code VARCHAR(10),
    recovery_expires TIMESTAMP,

    role VARCHAR(20) DEFAULT 'user',

    first_name VARCHAR(100),
    last_name VARCHAR(100),
    birth_date DATE,
    country VARCHAR(100),

    last_login TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);