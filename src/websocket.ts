import type { ServerWebSocket } from "bun";
import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();

const app = new Hono();

app.get(
	"/",
	upgradeWebSocket((c) => {
		return {
			onMessage(event, ws) {
				console.log(ws.raw);
				console.log(`Message from client: ${event.data}`);
				ws.send("Hello from server!");
			},
			onClose: () => {
				console.log("Connection closed");
			},
		};
	}),
);

export { app as SocketRoutes, websocket };
