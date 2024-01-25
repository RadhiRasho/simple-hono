import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("GET: /"));
app.post("/post", async (c) => {
	const body = await c.req.json();
	return c.json(body);
});
app.delete("/delete", (c) => c.text("SUCCESS"));

app.get("/posts", (c) => {
	return c.text("Many posts");
});

app.post("/posts", (c) => {
	return c.json(
		{
			message: "Created",
		},
		201,
		{
			"X-Custom": "Thank you",
		},
	);
});

export default app;
