import { Hono } from "hono";
// import { getRouterName, showRoutes } from "hono/dev";

import Routes from "./routes";
import Context from "./context";
import HonoReq from "./hono-request";
// import Socket from "./websocket";
import MiddleWare from "./middleware";
import Helpers from "./helpers";
import JSX from "./jsx";
import Validator from "./validator";
import RPC from "./rpc";
import BestPractices from "./best-practices";
import TProxy from "./proxy";
import JWTAuth from "./jwt-auth";
import Streaming from "./streaming";

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
app.route("/best-practices", BestPractices);
app.route("/proxy", TProxy);
app.route("/jwt-auth", JWTAuth);
app.route("/stream", Streaming);

// console.log("======c Get Router Name =======");
// console.log(getRouterName(app));

// console.log("========= Get Routes =========");
// showRoutes(app);

export default app;
