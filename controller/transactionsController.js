import { sql } from "../config/db.js";
import sendMail from "../util/sendMail.js";

export const getTransactionsByUserId =  async (req, res) => {
    try {
        if (!req.user.id) {
            return res.status(401).json({
                message: "Restricted access"
            })
        }

        const transaction = await sql`
        SELECT * FROM transactions WHERE user_id = ${req.user.id} ORDER BY created_at DESC
        `;

        res.status(200).json(transaction);
    } catch (error) {
        console.log("Error fetching the transaction: ", error)
        res.status(500).json({
            message: "internal server error"
        })
    }
}

export const createTransaction = async (req, res) => {
    try {
        const { title, amount, category, user_id } = req.body
        if (!title || !user_id || !category || amount === undefined) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const transaction = await sql`
        INSERT INTO transactions(user_id,title,amount,category)
        VALUES (${user_id},${title},${amount},${category})
        RETURNING *
        `;
        console.log(transaction)
        res.status(201).json(transaction[0])
    } catch (error) {
        console.log("Error creating the transaction: ", error)
        res.status(500).json({
            message: "internal server error"
        })
    }
}

export const getTransactionsSummaryByUserId =  async (req, res) => {
    try {        
        if (!req.user.id) {
            return res.status(401).json({
                message: "Restricted access"
            })
        }
                sendMail({
                    recipient_email: "ndukubachidinma+test@gmail.com",
                    subject: "OTP",
                    templateName: "otp.html",
                    variables: {
                        otp: "123456",
                        name: "Nneoma"
                    }
                })
        

        const balanceResult = await sql`
        SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${req.user.id}
        `

        const incomeResult = await sql`
        SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${req.user.id} and amount > 0
        `;

        const expensesResult = await sql`
        SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id = ${req.user.id} and amount < 0
        `;

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expensesResult[0].expenses

        });
    } catch (error) {
        console.log("Error fetching the transaction summary: ", error)
        res.status(500).json({
            message: "internal server error"
        })
    }
}

export const deleteTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(parseInt(id))) {
            return res.status(400).json({
                message: "Invalid transaction ID"
            })
        }
        const result = await sql`
        DELETE FROM transactions WHERE id = ${id} RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({
                message: "Transaction not found"
            })
        }

        res.status(200).json({
            message: "Transaction deleted successfully"
        });
    } catch (error) {
        console.log("Error fetching the transaction: ", error)
        res.status(500).json({
            message: "internal server error"
        })
    }
}