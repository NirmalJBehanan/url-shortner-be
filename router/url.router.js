import express from "express"
import { createUrl, createUser, forgetPassword, login, profile, redirect, resetPassword, urlHistory, verifyTokens} from "../controller/url.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = express.Router()
router.post("/url",authMiddleware,createUrl)
router.get("/history",authMiddleware,urlHistory)
router.get("/short/:shortCode",redirect)
router.post("/register",createUser)
router.post("/login",login)
router.post("/forgotPassword",forgetPassword)
router.put("/resetPassword/:token",authMiddleware,resetPassword)
router.get("/verifytokens",authMiddleware,verifyTokens)
router.get("/profile",authMiddleware,profile)

export default router;