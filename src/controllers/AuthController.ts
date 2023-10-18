import { Request, Response, NextFunction } from "express";

export class AuthController {
    constructor() {}

    register(req: Request, res: Response, next: NextFunction) {
        res.status(201).json({ message: "Hello" });
    }
}
