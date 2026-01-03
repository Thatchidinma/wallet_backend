import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import "dotenv/config"
import { sql } from "../config/db.js";
import sendMail from '../util/sendMail.js';

export const signUp = async (req, res) => {
    try {

        sendMail({
            recipient_email: "ndukubachidinma+test@gmail.com",
            subject: "OTP",
            templateName: "otp.html",
            variables: {
                otp: "123456",
                name: "Nneoma"
            }
        })

        const { user_name, email, password } = req.body
        if (!user_name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;

        console.log(existingUser)

        if (existingUser.length > 0) {
            return res.status(409).json({
                message: "User already exist"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await sql`
                INSERT INTO users(user_name,email,password)
                VALUES (${user_name},${email},${hashedPassword})
                RETURNING *`;

        console.log(newUser[0])
        const token = jwt.sign({ userId: newUser[0].id, }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

        res.status(201).json({
            success: true,
            message: "User created successful",
            data: {
                token,
                user: newUser[0]
            }
        })

    } catch (error) {
        console.log("Error signing up: ", error)
        res.status(500).json({
            message: "internal server error"
        })
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await sql`SELECT * FROM users WHERE email = ${email}`;

        if (user.length === 0) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user[0].password)

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid Password"
            })
        }

        const token = jwt.sign({ userId: user[0].id, }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

        res.status(200).json({
            success: true,
            message: 'User sign in successfully',
            data: {
                token,
                user: user[0]
            }
        })
    } catch (error) {
        console.log("Error signing in: ", error)
        res.status(500).json({
            message: "internal server error"
        })    }
}

// export const signOut = async (req, res, next) => {

// }