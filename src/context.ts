import { Hono, type MiddlewareHandler } from "hono";

type Variables = {
	message: string;
};

const app = new Hono<{ Variables: Variables }>();

// REQUEST EQUALS INSTANCE OF HONOREQUEST

app.get("/hello", (c) => {
	const userAgent = c.req.header("User-Agent");

	if (userAgent) return c.text(userAgent);

	return c.text("No Agent");
});

app.get("/welcome", (c) => {
	// Set headers
	c.header("X-Message", "Hello!");
	c.header("Content-Type", "text/plain");

	// Set HTTP status code
	c.status(201);

	// Return the response body
	return c.body("Thank you for coming");
});

app.get("/welcome2", (c) => {
	return c.body("Thank you for coming Again", 201, {
		"X-Message": "Hello!",
		"Content-Type": "text/plain",
	});
});

app.get("/welcome3", () => {
	return new Response("Thank you for coming Again Again", {
		status: 201,
		headers: {
			"X-Message": "HI THERE",
			"Content-Type": "text/plain",
		},
	});
});

app.get("/say", (c) => {
	return c.text("Hello!");
});

app.get("/api", (c) => {
	return c.json({ message: "Hello!" });
});

app.get("/notfound", (c) => {
	return c.notFound();
});

app.get("/redirect", (c) => {
	return c.redirect("/context");
});

app.get("/redirect-permanently", (c) => {
	return c.redirect("/context", 301);
});

app.use("/", async (c, next) => {
	await next();
	c.res.headers.append("X-Debug", "Debug message");
});

app.get("/", (c) => {
	return c.html("<h1>Hello! Hono!</h1>");
});

app.use("*", async (c, next) => {
	c.set("message", "Hono is cool!!");
	await next();
});

app.get("/message", (c) => {
	const message = c.get("message");
	return c.text(`The message is "${message}"`);
});

const one = new Hono();

const echoMiddleware: MiddlewareHandler<{
	Variables: {
		echo: (str: string) => string;
	};
}> = async (c, next) => {
	c.set("echo", (str) => str);
	await next();
};

one.get("/echo", echoMiddleware, (c) => {
	return c.text(c.var.echo("Hello!"));
});

app.route("/one", one);

app.use("*", async (c, next) => {
	c.setRenderer((content) => {
		return c.html(
			`<html>
        <body>
          <p style="color: red;">${content}</p>
        </body>
      </html>`,
		);
	});
	await next();
});

app.get("/html", (c) => {
	return c.render("Hello!");
});

export default app;
