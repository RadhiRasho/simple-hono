import { Hono } from "hono";

const app = new Hono();

app.get("/posts/:filename{.+.png$}", (c) => {
	const referer = c.req.header("Referer");
	console.log(referer);
	if (referer && !/^https:\/\/example.com/.test(referer)) {
		return c.text("Forbidden", 403);
	}
	return fetch(c.req.url);
});

app.get("*", (c) => {
	return fetch(c.req.url);
});

export default app;