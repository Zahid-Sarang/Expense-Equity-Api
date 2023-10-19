import express, { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import { AuthController } from "../controllers/AuthController";
import { User } from "../entity/User";
import { UserService } from "../services/UserService";
import registerValidators from "../validators/register-validators";

const authRouter = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService, logger);

authRouter.post("/register", registerValidators, (req: Request, res: Response) =>
    authController.register(req, res),
);

export default authRouter;
