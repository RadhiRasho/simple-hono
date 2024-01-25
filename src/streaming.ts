import { Hono } from "hono";
import { stream, streamText, streamSSE } from "hono/streaming";

const app = new Hono();

const file = Bun.file("src/testing.mp4");

app.get("/", (c) => {
	return stream(c, async (stream) => {
		// Write a process to be executed when aborted.
		stream.onAbort(() => {
			console.log("Aborted!");
		});

		// Write a Uint8Array.
		// await stream.write(new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]));
		// await stream.sleep(1000);
		const arrBuffer = await file.arrayBuffer();
		const data = new Uint8Array(arrBuffer);
		// Pipe a readable stream.
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
			await stream.sleep(1000);
		}
	});
});

export default app;
