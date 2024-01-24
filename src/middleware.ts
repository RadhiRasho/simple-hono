import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";

const app = new Hono();

//! Execution Order

app.use(async (_, next) => {
	console.log("middleware 1 start");
	await next();
	console.log("middleware 1 end");
});
app.use(async (_, next) => {
	console.log("middleware 2 start");
	await next();
	console.log("middleware 2 end");
});
app.use(async (_, next) => {
	console.log("middleware 3 start");
	await next();
	console.log("middleware 3 end");
});

app.get("/", (c) => {
	console.log("handler");
	return c.text("Hello!");
});

//! In the case of middleware:
//! Logger() -> cors() -> basicAuth() -> *handler* (meaning anything like routes)

app.use("/posts", logger());
app.use("/posts", cors());
app.use(
	"/posts",
	basicAuth({
		username: "admin",
		password: "admin",
	}),
);

app.post("/posts", async (c) => {
	const data = await c.req.json();
	console.log(data);
	return c.json(data);
});

//! Built-in Middleware

app.use("/tests", poweredBy());
app.use("/tests", logger());

app.use(
	"/auth/*",
	basicAuth({
		username: "hono",
		password: "acoolproject",
	}),
);

//! Custom logger
app.use("*", async (c, next) => {
	console.log(`[${c.req.method}] ${c.req.url}`);
	await next();
});

//! Add a custom header
app.use("/message/*", async (c, next) => {
	await next();
	c.header("x-message", "This is middleware!");
});

app.get("/message/hello", (c) => c.text("Hello Middleware!"));

//! Hono does have Third-Party Middleware avaliable such as Firebase Auth, GraphQL and so on....

export default app;
