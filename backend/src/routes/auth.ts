import express, { Router, Request, Response } from "express";
import { authController } from "../controllers/authController";

const authRouter = Router();
authRouter.post("/login", async (req: Request, res: Response) => {
    await authController.login(req, res)
});

authRouter.post("/register", async (req: Request, res: Response) => {
    await authController.register(req, res)
});

export default authRouter;