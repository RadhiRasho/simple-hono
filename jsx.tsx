import { Hono } from "hono"

const app = new Hono()

function Layout(props: { children: any }) {
  return (
    <html lang="en">
      <body style={{ color: 'white', backgroundColor: 'black' }} >{props.children}</body>
    </html>
  )
}

function Top(props: { messages: string[] }) {
  return (
    <Layout>
      <h1>Hello Hono!</h1>
      <ul>
        {props.messages.map((message: string) => <li>{message}!!</li>)}
      </ul>
    </Layout>
  )
}

app.get('/', (c) => {
  const messages = ['Good Morning', 'Good Evening', 'Good Night']
  return c.html(<Top messages={messages} />)
})

export default app;