import { Hono } from "hono";
import { contextStorage, getContext } from "hono/context-storage";

type Variables = {
	message: string;
	mean: string;
	mid: "bad" | "ass" | "cheecks";
};

type KVNamespace = {
	DBConnectionString: string;
};

type Bindings = {
	KV: KVNamespace;
};

type Env = {
	Variables: Variables;
	Bindings: Bindings;
};

const app = new Hono<Env>();

app.use(contextStorage());

app.use(async (c, next) => {
	const body = await c.req.json<Variables>();

	console.log(body);

	if (body.mid !== "cheecks") throw new Error("Bad");
	c.set("message", body.message);
	c.set("mean", body.mean);
	c.set("mid", body.mid);

	await next();
});

app.post("/", async (c) => {
	return c.text(getMessage());
});

const getMessage = () => {
	return `${getContext<Env>().var.message} ${getContext<Env>().var.mean} ${getContext<Env>().var.mid}`;
};

export default app;