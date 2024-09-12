import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import app from "../src/testing";

describe("Example", () => {
	test("GET /posts", async () => {
		const res = await app.request("/posts");
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("Many posts");
	});

	test("POST /posts", async () => {
		const res = await app.request("/posts", {
			method: "POST",
		});
		expect(res.status).toBe(201);
		expect(res.headers.get("X-Custom")).toBe("Thank you");
		expect(await res.json()).toEqual({
			message: "Created",
		});
	});

	test("POST /posts", async () => {
		const req = new Request("http://localhost/posts", {
			method: "POST",
		});
		const res = await app.request(req);
		expect(res.status).toBe(201);
		expect(res.headers.get("X-Custom")).toBe("Thank you");
		expect(await res.json()).toEqual({
			message: "Created",
		});
	});

	const MOCK_ENV = {
		API_HOST: "example.com",
		DB: {
			prepare: () => {
				/* mocked D1 */
			},
		},
	};

	test("GET /posts", async () => {
		const res = await app.request("/posts", {}, MOCK_ENV);
	});

	test("test", async () => {
		const payload = { hello: "world" };
		const app = new Hono()
			.get("/search", (c) => c.json(payload))
			.post("/post", async (c) => c.json(payload));

		const client = testClient(app);
		const res = await (await client.search.$get()).json();
		const res2 = await (await client.post.$post()).json();

		expect(res).toEqual(payload);
		expect(res2).toEqual(payload);
	});
});
