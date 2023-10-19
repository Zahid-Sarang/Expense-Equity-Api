import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post("/register", (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next),
);

export default authRouter;
