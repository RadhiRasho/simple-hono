import { Hono } from "hono";
// import { getRouterName, showRoutes } from "hono/dev";

import Routes from "./routes";
import Context from "./context";
import HonoReq from "./hono-request";

import MiddleWare from "./middleware";
import Helpers from "./helpers";
import JSX from "./jsx";
import Validator from "./validator";
import RPC from "./rpc";
import BestPractices from "./best-practices";
import TProxy from "./proxy";
import JWTAuth from "./jwt-auth";
import Streaming from "./streaming";
import { timing } from "hono/timing";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import Anime from "./anime";
import ContextStorage from "./context-storage";
import { SocketRoutes, websocket } from "./websocket";

const app = new Hono();

app.use("*", timing({ enabled: (c) => c.req.method === "GET" }));
app.use("*", logger());
app.use("*", prettyJSON());

app.route("/routes", Routes);
app.route("/context", Context);
app.route("/request", HonoReq);

app.route("/middleware", MiddleWare);
app.route("/helpers", Helpers);
app.route("/jsx", JSX);

app.route("/validator", Validator);
app.route("/rpc", RPC);
app.route("/best-practices", BestPractices);
app.route("/proxy", TProxy);
app.route("/jwt-auth", JWTAuth);
app.route("/stream", Streaming);
app.route("/anime", Anime);
app.route("/context-storage", ContextStorage);

app.route("/ws", SocketRoutes);

//! console.log("======c Get Router Name =======");
//! console.log(getRouterName(app));

//! console.log("========= Get Routes =========");
//! console.log(showRoutes(app));

export default {
	fetch: app.fetch,
	websocket,
};
