import { Hono } from "hono";

import Routes from "./routes";
import Context from "./context";
import HonoReq from "./hono-request";
// import Socket from "./websocket";
import MiddleWare from "./middleware";
import Helpers from "./helpers";
import JSX from "./jsx";
import Validator from "./validator";
import RPC from "./rpc";

const app = new Hono();

app.route("/routes", Routes);
app.route("/context", Context);
app.route("/request", HonoReq);
// app.route("/ws", Socket);
app.route("/middleware", MiddleWare);
app.route("/helpers", Helpers);
app.route("/jsx", JSX);

app.route("/validator", Validator);
app.route("/rpc", RPC);

export default app;
