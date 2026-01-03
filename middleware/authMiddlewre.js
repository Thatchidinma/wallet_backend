import "dotenv/config"
import jwt from 'jsonwebtoken'
import { sql } from "../config/db.js";

const authorize = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await sql`
        SELECT * FROM users WHERE id = ${decoded.userId} 
        `;

        if (user.length === 0) {
            return res.status(401).json(
                {
                    message: 'Unauthorized'
                }
            )
        }

        req.user = user[0]
        next()

    } catch (error) {
        res.status(401).json(
            {
                message: "Unauthorized",
                error: error.message
            }
        )
    }
}

export default authorize