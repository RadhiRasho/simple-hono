import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

const routeA = app.post(
	"/posts",
	zValidator(
		"form",
		z.object({
			title: z.string(),
			body: z.string(),
		}),
	),
	(c) => {
		return c.json(
			{
				ok: true,
				message: "Created!",
			},
			201,
		);
	},
);

const routeB = app.get(
	"/posts/:id",
	zValidator(
		"query",
		z.object({
			page: z.string().optional(),
		}),
	),
	(c) => {
		return c.json({
			title: "Night",
			body: "Time to sleep",
		});
	},
);

export type AppType = typeof routeA & typeof routeB;

export default app;