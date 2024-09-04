import { Hono } from "hono";
import type { SearchResults } from "@/types/anime";

const app = new Hono();

const baseURL = "https://api.jikan.moe/v4";

app.get("/:search", async (c) => {
	const { search } = c.req.param();
	const res = await fetch(
		`${baseURL}/anime?sfw=true&q=${search}&order=popularity&type=tv`,
	);
	const data = (await res.json()) as SearchResults;

	return c.json(data);
});

export default app;