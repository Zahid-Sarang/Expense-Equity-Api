import { Response } from "express";
import { UserService } from "../services/UserService";
import { RegisterUserRequest } from "../types";

export class AuthController {
    constructor(private userService: UserService) {}

    async register(req: RegisterUserRequest, res: Response) {
        const { firstName, lastName, email, password } = req.body;
        await this.userService.createUser({ firstName, lastName, email, password });

        res.status(201).json();
    }
}
