import { resolve } from "path";

import fastifyStatic from "@fastify/static";

const plugin = async (server) => {
  server.register(fastifyStatic, {
    index: "index.html",
    prefix: "/",
    root: resolve(process.cwd(), "./dist/"),
  });
};

export default plugin;
