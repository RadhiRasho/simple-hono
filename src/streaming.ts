import { createWriteStream } from "node:fs";
import ytdl from "@distube/ytdl-core";
import { Hono } from "hono";
import { stream, streamSSE, streamText } from "hono/streaming";

const app = new Hono();

const file = Bun.file("src/testing.mp4");

app.get("/", (c) => {
	return stream(c, async (stream) => {
		// Write a process to be executed when aborted.
		stream.onAbort(() => {
			console.log("Aborted!");
		});

		const arrBuffer = await file.arrayBuffer();
		const data = new Uint8Array(arrBuffer);

		// Pipe a readable stream.
		await stream.write(data);
	});
});

app.get("/video", async (c) => {
	const url = "https://www.youtube.com/watch?v=WQCFOG68Sfo";

	ytdl(url).pipe(createWriteStream("video.mp4"));

	const file = Bun.file("src/output.mp4");

	c.header("Transfer-Encoding", "chunked");

	return stream(c, async (stream) => {
		const arrBuffer = await file.arrayBuffer();
		const data = new Uint8Array(arrBuffer);

		stream.onAbort(() => console.log("Goodbye"));

		await stream.write(data);
	});
});

app.get("/text", (c) => {
	return streamText(c, async (stream) => {
		// Write a text with a new line ('\n').
		await stream.writeln("Hello");
		// Wait 1 second.
		await stream.sleep(1000);
		// Write a text without a new line.
		await stream.write("Hono!");
	});
});

let id = 0;

app.get("/sse", async (c) => {
	return streamSSE(c, async (stream) => {
		while (true) {
			const message = `It is ${new Date().toISOString()}`;
			await stream.writeSSE({
				data: message,
				event: "time-update",
				id: String(id++),
			});
			await stream.sleep(10000);
		}
	});
});

export default app;
