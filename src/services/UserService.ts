import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import bcrypt from "bcrypt";

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async createUser({ firstName, lastName, email, password }: UserData) {
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return await this.userRepository.save({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
    }
}
