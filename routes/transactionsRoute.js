import express from "express"
import { createTransaction, deleteTransactionById, getTransactionsByUserId, getTransactionsSummaryByUserId } from "../controller/transactionsController.js";

const router = express.Router();

router.post("/", createTransaction)

router.get("/", getTransactionsByUserId)

router.get("/summary", getTransactionsSummaryByUserId)

router.delete("/:id", deleteTransactionById)

export default router