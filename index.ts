import { Hono } from "hono";

import Routes from "./routes";
import Context from "./context";
import HonoReq from "./hono-request";
import Socket from "./websocket";

const app = new Hono();

app.route("/routes", Routes);
app.route("/context", Context);
app.route("/request", HonoReq);
app.route("/ws", Socket);

export default app;
