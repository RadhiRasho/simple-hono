import { Hono } from "hono";
import { stream } from "hono/streaming";

const app = new Hono();

app.get("/entry/:id", (c) => {
	const { id } = c.req.param();

	return c.text(id);
});

app.get("/entry/:id/comments/:commendId", (c) => {
	const { id, commendId } = c.req.param();

	return c.text(`${id} - ${commendId}`);
});

// Query params
app.get("/search", (c) => {
	const query = c.req.query("q");

	return c.text(JSON.stringify(query));
});

// Get all params at once
app.get("/search2", (c) => {
	const { q, limit, offset } = c.req.query();

	return c.text(`${q} - ${limit} - ${offset}`);
});

app.get("/search3", (c) => {
	// tags will be string[]
	const tags = c.req.queries("tags");

	return c.json(tags);
});

app.get("/agent", (c) => {
	const userAgent = c.req.header("User-Agent");

	return c.text(`${userAgent}`);
});

app.post("/entry", async (c) => {
	const body = await c.req.parseBody();

	return c.json(body);
});

app.post("/entry2", async (c) => {
	const body = await c.req.json();

	return c.json(body);
});

app.post("/entry3", async (c) => {
	const body = await c.req.text();
	return c.json(body);
});

app.post("/entry4", async (c) => {
	const body = await c.req.arrayBuffer();

	return stream(c, async (stream) => {
		stream.onAbort(() => {
			console.log("Aborted!!");
		});

		const byteArray = new Uint8Array(body);

		await stream.write(byteArray);
	});
});

app.get("/posts/:id", (c) => {
	return c.json({ path: c.req.routePath });
});

app.use("*", async function logger(c, next) {
	await next();
	c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
		const name =
			handler.name || (handler.length < 2 ? "[handler]" : "[middleware]");
		console.log(
			method,
			" ",
			path,
			" ".repeat(Math.max(10 - path.length, 0)),
			name,
			i === c.req.routeIndex ? "<- respond from here" : "",
		);
	});
});

app.get("/about/me", (c) => {
	const pathname = c.req.path; // `/about/me`

	return c.text(pathname);
});

app.get("/about/me/again", (c) => {
	const url = c.req.url; // `http://localhost:8787/about/me`

	return c.text(url);
});

app.get("/about/me/again/again", (c) => {
	const method = c.req.method; // `GET`

	return c.text(method);
});

export default app;
