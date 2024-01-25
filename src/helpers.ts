import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";

const app = new Hono();

app.get("/cookies", (c) => {
	const yummyCookie = getCookie(c, "yummyCookie");
	setCookie(c, "delicious_cookie", "macha");

	if (yummyCookie) return c.text(yummyCookie);
	return c.text("NO COOKIE");
});

export default app;
