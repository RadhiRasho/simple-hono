import { Hono } from "hono";

import Routes from "./routes";
import Context from "./context";
import HonoReq from "./hono-request";

const app = new Hono();

app.route("/routes", Routes);
app.route("/context", Context);
app.route("/request", HonoReq);

export default app;
