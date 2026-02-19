import { rest } from "msw";

export const handlers = [
    rest.post("/login", (req, res, ctx) => {
        const { username, password } = req.body as {
            username: string;
            password: string;
        };
        console.log("🚀 ~ username, password:", username, password)

        if (username === "test" && password === "test123") {
            return res(
                ctx.status(200),
                ctx.json({ token: "fake-jwt-token" })
            );
        }

        return res(
            ctx.status(401),
            ctx.json({ message: "Invalid credentials" })
        );
    })
];
