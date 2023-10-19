import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";

describe("POST /auth/register", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // Database truncate
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given All Fields", () => {
        it("should return the 201 status code", async () => {
            // Arrange
            const userData = {
                firstName: "Zahid",
                lastName: "Sarang",
                email: "zahidSarang@gmail.com",
                password: "password",
            };
            // Act
            const repsonse = await request(app).post("/auth/register").send(userData);
            // Assert
            expect(repsonse.statusCode).toBe(201);
        });

        it("should return a valid json object", async () => {
            // Arrange
            const userData = {
                firstName: "Zahid",
                lastName: "Sarang",
                email: "zahidSarang@gmail.com",
                password: "password",
            };
            // Act
            const repsonse = await request(app).post("/auth/register").send(userData);

            // Assert
            expect((repsonse.headers as Record<string, string>)["content-type"]).toEqual(
                expect.stringContaining("json"),
            );
        });

        it("should persist the user in database", async () => {
            // Arrange
            const userData = {
                firstName: "Zahid",
                lastName: "Sarang",
                email: "zahidSarang@gmail.com",
                password: "password",
            };
            // Act
            await request(app).post("/auth/register").send(userData);

            //Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
        });

        it("should return the created user Id", async () => {
            // Arrange
            const userData = {
                firstName: "Zahid",
                lastName: "Sarang",
                email: "zahidSarang@gmail.com",
                password: "password",
            };
            // Act
            const response = await request(app).post("/auth/register").send(userData);

            //Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(response.body).toHaveProperty("id");
            expect((response.body as Record<string, string>).id).toBe(users[0].id);
        });

        it("should store the hashed password in database", async () => {
            // Arrange
            const userData = {
                firstName: "Zahid",
                lastName: "Sarang",
                email: "zahidSarang@gmail.com",
                password: "password",
            };
            // Act
            await request(app).post("/auth/register").send(userData);

            //Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        });

        it.todo("should return if email is already exists");
        it.todo("should return the access token and refresh token inside a cookie");
        it.todo("should store the refresh token in the database");
    });

    describe("Fileds are missing", () => {
        it("should return 400 status code if inputs fields are missing", async () => {
            const userData = {
                firstName: "",
                lastName: "Sarang",
                email: "zahid@gmail.com",
                password: "password",
            };
            // Act
            const response = await request(app).post("/auth/register").send(userData);

            // Assert
            expect(response.statusCode).toBe(400);
        });
    });

    describe("Fields are not in proper format ", () => {
        it("should trim the email field", async () => {
            // Arrange
            const userData = {
                firstName: "zahid",
                lastName: "sarang",
                email: " zahid95@gmail.com ",
                password: "password",
            };
            // Act
            await request(app).post("/auth/register").send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            const user = users[0];
            expect(user.email).toBe("zahid95@gmail.com");
        });

        it("should return 400 if  email is not a valid email", async () => {
            // Arrange
            const userData = {
                firstName: "zahid",
                lastName: "sarang",
                email: "zahid_mern.space", // Invalid email
                password: "password",
            };
            // Act
            const response = await request(app).post("/auth/register").send(userData);

            //Assert
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });

        it("should return 400 if  password length is less than 8 character", async () => {
            // Arrange
            const userData = {
                firstName: "zahid",
                lastName: "sarang",
                email: "zahidsarang@gmail.com", // Invalid email
                password: "pass",
            };
            // Act
            const response = await request(app).post("/auth/register").send(userData);

            //Assert
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });

        it("should return an array of error message if email is missing", async () => {
            // Arrange
            const userData = {
                firstName: "zahid",
                lastName: "sarang",
                email: "",
                password: "password",
            };
            // Act
            const response = await request(app).post("/auth/register").send(userData);

            //Assert
            expect(response.body).toHaveProperty("errors");
            expect((response.body as Record<string, string>).errors.length).toBeGreaterThan(0);
        });
    });
});
