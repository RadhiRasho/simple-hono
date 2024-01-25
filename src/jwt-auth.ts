import { Hono } from "hono";
import { decode, sign, verify } from "hono/jwt";

const app = new Hono();

const payload = {
	sub: "user123",
	role: "admin",
};

const secret = "mySecretKey";

const token = await sign(payload, secret, "HS512");

app.get("/", (c) => c.text(`JWT Token: ${token}`));
app.get("/verify", async (c) => {
	const decodedPayload = await verify(token, secret, "HS512");

	return c.json(decodedPayload);
});
app.get("/decode", (c) => {
	const { header, payload } = decode(token);

	console.log(header);
	console.log(payload);

	return c.json({ header, payload });
});

export default app;