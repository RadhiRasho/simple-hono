import { Hono } from "hono";
// import { getRouterName, showRoutes } from "hono/dev";

import Context from "./context";
import HonoReq from "./hono-request";
import Routes from "./routes";

import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { timing } from "hono/timing";
import Anime from "./anime";
import BestPractices from "./best-practices";
import ContextStorage from "./context-storage";
import Helpers from "./helpers";
import JSX from "./jsx";
import JWTAuth from "./jwt-auth";
import MiddleWare from "./middleware";
import TProxy from "./proxy";
import RPC from "./rpc";
import Streaming from "./streaming";
import Validator from "./validator";
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
