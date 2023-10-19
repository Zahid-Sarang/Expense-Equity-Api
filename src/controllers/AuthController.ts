import { Response } from "express";
import { validationResult } from "express-validator";
import { Logger } from "winston";
import { UserService } from "../services/UserService";
import { RegisterUserRequest } from "../types";

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    async register(req: RegisterUserRequest, res: Response) {
        // validate request fields
        const validate = validationResult(req);
        if (!validate.isEmpty()) {
            return res.status(400).json({ errors: validate.array() });
        }

        const { firstName, lastName, email, password } = req.body;
        const user = await this.userService.createUser({ firstName, lastName, email, password });
        this.logger.debug("New request to register a user: ", {
            firstName,
            lastName,
            email,
            password: "****",
        });

        res.status(201).json({ id: user.id });
    }
}
