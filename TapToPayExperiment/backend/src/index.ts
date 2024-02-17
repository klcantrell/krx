import { ServeOptions } from "bun";
import { Hono } from "hono";
import Stripe from "stripe";

const { env } = import.meta;

const app = new Hono();

const stripe = new Stripe(env.STRIPE_SECRET, {
  apiVersion: "2023-10-16",
});

app.get("/connection_token", async (c) => {
  console.log("received connection token request");
  const token = await stripe.terminal.connectionTokens.create();
  return c.json({
    secret: token.secret,
    location: env.STRIPE_TERMINAL_LOCATION,
  });
});

const serveOptions: ServeOptions = {
  fetch: app.fetch,
  port: 3000,
  hostname: "0.0.0.0",
};

export default serveOptions;

declare module "bun" {
  interface Env {
    STRIPE_SECRET: string;
    STRIPE_TERMINAL_LOCATION: string;
  }
}
