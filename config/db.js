import {neon} from "@neondatabase/serverless"

import "dotenv/config";

export const sql = neon(process.env.DATABASE_URL)

export async function initDB() {
    try {
        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

        await sql`CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
        user_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        CONSTRAINT valid_email_format CHECK (
        email ~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'
        ),
        password VARCHAR(255) NOT NULL,
        updated_at DATE NOT NULL DEFAULT CURRENT_DATE,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        await sql`CREATE TABLE IF NOT EXISTS transactions(
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
        user_id VARCHAR(225) NOT NULL,
        title VARCHAR(225) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(225) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        // await sql `CREATE TABLE IF NOT EXISTS otp_codes(
        // id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        // user_id UUID NOT NULL,
        // otp_code VARCHAR(6) NOT NULL,
        // otp_expiry TIMESTAMP NOT NULL,
        // created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        // FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        // )`

        console.log("Datebase initialized successfully")
    } catch (error) {
        console.log("Error initializing DB: ", error)
        process.exit(1)
    }
}