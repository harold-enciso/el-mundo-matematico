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


CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    
    user_id BIGINT NOT NULL,
    
    title TEXT NOT NULL,
    message TEXT NOT NULL,

    link TEXT,
    
    image_url TEXT,
    file_url TEXT,
    file_name TEXT,
    file_type TEXT,
    file_size BIGINT,

    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,

    is_archived BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW()
);



GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE tabla TO usuario;

GRANT USAGE, SELECT, UPDATE ON SEQUENCE tabla_id_seq TO usuario;