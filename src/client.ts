import { hc } from "hono/client";
import { AppType } from "./rpc";

const client = hc<AppType>("http://localhost:3000/rpc", {
	headers: {
		Authorization: "Bearer TOKEN",
	},
});

const resA = await client.posts.$post({
	form: {
		title: "Hello",
		body: "Hono is a cool project",
	},
});

const resB = await client.posts[":id"].$get({
	param: {
		id: "123",
	},
	query: {},
});

if (resA.ok) {
	const data = await resA.json();
	console.log(data.message);
}

console.log(resB);

if (resB.ok) {
	const data = await resB.json();
	console.log(data.title, data.body);
}
