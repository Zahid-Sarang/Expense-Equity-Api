import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import { AuthController } from "../controllers/AuthController";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import { UserService } from "../services/UserService";
import registerValidators from "../validators/register-validators";
import { TokenService } from "../services/TokenService";

const authRouter = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const refreshToken = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshToken);
const authController = new AuthController(userService, logger, tokenService);

authRouter.post(
    "/register",
    registerValidators,
    (req: Request, res: Response, next: NextFunction) => authController.register(req, res, next),
);

export default authRouter;
