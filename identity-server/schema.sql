CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    sub TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE tokens (
    id SERIAL PRIMARY KEY,
    access_token TEXT UNIQUE NOT NULL,
    refresh_token TEXT UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    expires_at TIMESTAMP NOT NULL
);