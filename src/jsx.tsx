import { Hono } from "hono";

const app = new Hono();

function Layout1(props: { children: any }) {
	return (
		<html lang="en">
			<body style={{ color: "white", backgroundColor: "black" }}>
				{props.children}
			</body>
		</html>
	);
}

function Top(props: { messages: string[] }) {
	return (
		<Layout1>
			<h1>Hello Hono!</h1>
			<ul>
				{props.messages.map((message: string) => (
					<li>{message}!!</li>
				))}
			</ul>
		</Layout1>
	);
}

app.get("/", (c) => {
	const messages = ["Good Morning", "Good Evening", "Good Night"];
	return c.html(<Top messages={messages} />);
});

//! Fragment Usage

import { ErrorBoundary, Fragment } from "hono/jsx";

const List = () => (
	<Fragment>
		<p>first child</p>
		<p>second child</p>
		<p>third child</p>
	</Fragment>
);

// OR

// const List = () => (
//   <>
//     <p>first child</p>
//     <p>second child</p>
//     <p>third child</p>
//   </>
// )

app.get("/list", (c) => {
	return c.html(<List />);
});

//! Raw html

app.get("/foo", (c) => {
	const inner = { __html: "JSX &middot; SSR" };
	// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
	const Div = <div dangerouslySetInnerHTML={inner} />;

	return c.html(Div);
});

//! Memoization of components

import { memo } from "hono/jsx";

const Header = memo(() => <header>Welcome to Hono</header>);
const Footer = memo(() => <footer>Powered by Hono</footer>);
const MemoLayout = (
	<div>
		<Header />
		<p>Hono is cool!</p>
		<Footer />
	</div>
);

app.get("/memo", (c) => {
	return c.html(MemoLayout);
});

//! Context

import { createContext, useContext } from "hono/jsx";

const themes = {
	light: {
		color: "#000000",
		background: "#eeeeee",
	},
	dark: {
		color: "#ffffff",
		background: "#222222",
	},
};

const ThemeContext = createContext(themes.light);

function Button() {
	const theme = useContext(ThemeContext);
	return (
		<button type="button" style={theme}>
			Push!
		</button>
	);
}

function Toolbar() {
	return (
		<div>
			<Button />
		</div>
	);
}

app.get("/context", (c) => {
	return c.html(
		<div>
			<ThemeContext.Provider value={themes.dark}>
				<Toolbar />
			</ThemeContext.Provider>
		</div>,
	);
});

//! Async Components

async function AsyncComponent1() {
	await new Promise((r) => setTimeout(r, 10000)); // sleep 1s
	return <div>Done!</div>;
}

app.get("/async", (c) => {
	return c.html(
		<html lang="en">
			<body>
				<AsyncComponent1 />
			</body>
		</html>,
	);
});

//! Suspense (Experimental Currently)
import { renderToReadableStream, Suspense } from "hono/jsx/streaming";

app.get("/suspense", (c) => {
	const stream = renderToReadableStream(
		<html lang="en">
			<body>
				<Suspense fallback={<div>loading...</div>}>
					<AsyncComponent1 />
				</Suspense>
			</body>
		</html>,
	);
	return c.body(stream, {
		headers: {
			"Content-Type": "text/html; charset=UTF-8",
			"Transfer-Encoding": "chunked",
		},
	});
});

//! ErrorBoundry (Experimental)

//? SYNC Components

function SyncComponent() {
	throw new Error("Error");
	// biome-ignore lint/correctness/noUnreachable: <Expected Error>
	return <div>Hello</div>;
}

app.get("/sync", async (c) => {
	return c.html(
		<html lang="en">
			<body>
				<ErrorBoundary fallback={<div>Out of Service</div>}>
					<SyncComponent />
				</ErrorBoundary>
			</body>
		</html>,
	);
});

//? ASYNC Components

async function AsyncComponent() {
	await new Promise((resolve) => setTimeout(resolve, 10000));
	throw new Error("Error");
	// biome-ignore lint/correctness/noUnreachable: <Expected Error>
	return <div>Hello</div>;
}

app.get("/with-suspense", async (c) => {
	return c.html(
		<html lang="en">
			<body>
				<ErrorBoundary fallback={<div>Out of Service</div>}>
					<Suspense fallback={<div>Loading...</div>}>
						<AsyncComponent />
					</Suspense>
				</ErrorBoundary>
			</body>
		</html>,
	);
});

//! Integration with HTML Middleware

import { html } from "hono/html";

interface SiteData {
	title: string;
	children?: any;
}

function Layout(props: SiteData) {
	return html`<!DOCTYPE html>
  <html>
    <head>
      <title>${props.title}</title>
    </head>
    <body>
      ${props.children}
    </body>
  </html>`;
}

function Content(props: { siteData: SiteData; name: string }) {
	return (
		<Layout {...props.siteData}>
			<h1>Hello {props.name}</h1>
		</Layout>
	);
}

app.get("/:name", (c) => {
	const { name } = c.req.param();
	const props = {
		name: name,
		siteData: {
			title: "JSX with html sample",
		},
	};
	return c.html(<Content {...props} />);
});

export default app;
