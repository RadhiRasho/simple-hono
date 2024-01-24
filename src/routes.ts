import { Hono } from "hono";
import { logger } from "hono/logger";
import { stream } from "hono/streaming";

const app = new Hono();

// BASICS

// HTTP Methods
app.get("/", (c) => c.text("GET /"));
app.post("/", (c) => c.text("POST /"));
app.put("/", (c) => c.text("PUT /"));
app.delete("/", (c) => c.text("DELETE /"));

// Wildcard
app.get("/wild/*/card", (c) => {
	return c.text("GET /wild/*/card");
});

// Any HTTP methods
app.all("/hello", (c) => c.text("Any Method /hello"));

// Custom HTTP method
app.on("PURGE", "/cache", (c) => c.text("PURGE Method /cache"));

// Multiple Method
app.on(["PUT", "DELETE"], "/post", (c) => c.text("PUT or DELETE /post"));

// PATH PARAMETER

app.get("/user/:name", (c) => {
	const name = c.req.param("name");
	console.log(name);

	return c.text(name);
});

app.get("/posts/:id/comment/:comment_id", (c) => {
	const { id, comment_id } = c.req.param();
	const data = `${id} - ${comment_id}`;
	return c.text(data);
});

// OPTIONAL PARAMETERS

// Will match `/api/animal` and `/api/animal/:type`
app.get("/api/animal/:type?", (c) => {
	const { type } = c.req.param();

	return type ? c.text(`${type} is an animal`) : c.text("ANIMALLLLL!!");
});

// REGEXP

app.get("/post/:date{[\\d]+}/:title{[a-zA-Z]+}", (c) => {
	const { date, title } = c.req.param();

	return c.text(`${date} - ${title}`);
});

// INCLUDING SLASHES

app.get("/posts/:filename{.+\\.png$}", async (c) => {
	return stream(c, async (stream) => {
		stream.onAbort(() => {
			console.log("Aborted!!");
		});
		const { filename } = c.req.param();
		const file = Bun.file(filename);

		const data = await file.arrayBuffer();
		const byteArray = new Uint8Array(data);
		await stream.write(byteArray);
	});
});

// CHAINING ROUTE

app
	.get("/endpoint", (c) => {
		return c.text("GET /endpoint");
	})
	.post((c) => {
		return c.text("POST /endpoint");
	})
	.delete((c) => {
		return c.text("DELETE /endpoint");
	});

// GROUPING

const book = new Hono();

book.get("/", (c) => c.text("List Books")); // GET /book
book.get("/:id", (c) => {
	// GET /book/:id
	const { id } = c.req.param();
	return c.text(`Get Book: ${id}`);
});
book.post("/", (c) => c.text("Create Book")); // POST /book

app.route("/book1", book);

// APPLYING BASE PATH

const api = new Hono().basePath("/api");

api.get("/book", (c) => c.text("List Books"));

app.route("/api", api);

// ROUTING VIA HOSTNAME
const one = new Hono({
	getPath: (req) => req.url.replace(/^https?:\/(.+?)$/, "$1"),
});

one.get("/www1.example.com/hello", (c) => c.text("hello www1"));
one.get("/www2.example.com/hello", (c) => c.text("hello www2"));

app.route("/one", one);

// ROUTING VIA `host` HEADER VALUE

const two = new Hono({
	getPath: (req) =>
		`/${req.headers.get("host")}${req.url.replace(
			/^https?:\/\/[^/]+(\/[^?]*)/,
			"$1",
		)}`,
});

two.get("/www1.example.com/hello", (c) => c.text("hello www1"));

// A following request will match the route:
// new Request('http://www1.example.com/hello', {
//  headers: { host: 'www1.example.com' },
// })

app.route("/two", two);

// ROUTING PRIORITY

const three = new Hono();

three.get("/book/a", (c) => c.text("a"));
three.get("/book/:slug", (c) => c.text(`Common => ${c.req.param("slug")}`));

three.get("*", logger());
three.get("/foo", (c) => c.text("foo"));

app.route("three", three);

// GROUPING ORDERING

const app4 = new Hono();
const app5 = new Hono();

app5.get("/hi", (c) => c.text("hi"));
app4.route("/five", app5);
app.route("/four", app4);

export default app;
