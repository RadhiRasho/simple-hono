import { Hono } from "hono";
import { serve } from "bun";

const app = new Hono();

serve({
	fetch: (req, server) => {
		if (server.upgrade(req)) {
			// handle authentication
		}
		return app.fetch(req, server);
	},
	websocket: {
		message(ws, message) {
			console.log(message);
			ws.ping();
			console.log(ws.readyState);
			console.log(ws.sendText("Jump Please"));
		},
		open(ws) {
			ws.send("Hello!");
		},
	},
	reusePort: true,
});

export default app;