import { Hono } from "hono";

const app = new Hono();

//! Don't make "Controllers" when possible
//! When possible, you should not create "Ruby on Rails-like Controllers".

import { Context } from "hono";

//! RoR = Ruby on Rails
//! 🙁
//! A RoR-like Controller
const booksList = (c: Context) => {
	return c.json("list books");
};

app.get("/books", booksList);

//! 🙁
//! A RoR-like Controller
const bookPermalink = (c: Context) => {
	const id = c.req.param("id"); // Can't infer the path param
	return c.json(`get ${id}`);
};

//* write handlers directly after path definitions
//* 😃
app.get("/books/:id", (c) => {
	const id = c.req.param("id"); // Can infer the path param
	return c.json(`get ${id}`);
});

//! If you want to use RoR-like Controllers

import { createFactory } from "hono/factory";
import { logger } from "hono/logger";

// 😃
const factory = createFactory();

const middleware = factory.createMiddleware(async (c, next) => {
	c.set("foo", "bar");
	await next();
});

const handlers = factory.createHandlers(logger(), middleware, (c) => {
	return c.json(c.var.foo);
});

app.get("/api", ...handlers);

//* Building Large Routes (This entire repo is an example of it);

export default app;
