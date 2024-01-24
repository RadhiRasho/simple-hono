import { Hono } from "hono";
import { validator } from "hono/validator";

const app = new Hono();

app.post(
	"/posts",
	validator("json", (value, c) => {
		const body = value;
		if (!body || typeof body !== "object") {
			return c.text("Invalid!", 400);
		}
		return {
			body: body,
		};
	}),
	(c) => {
		const { body } = c.req.valid("json");

		return c.json(
			{
				message: "Created!",
				body,
			},
			201,
		);
	},
);

//! Can use Zod
//.........

export default app;