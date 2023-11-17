import react from "@vitejs/plugin-react-swc";
import bodyParser from "body-parser";
import type { Express } from "express";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import serveStatic from "serve-static";
import { createServer } from "vite";
import { backendCredentials } from "../helpers/domain.js";
import { REDIRECT_URL_ENDPOINT } from "../helpers/redirect-url.js";
import { loginEndPoint } from "./login.js";
import { progressEndPoint } from "./progress.js";
import { renderEndPoint } from "./render.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const startViteDevelopmentServer = async (app: Express) => {
  const server = await createServer({
    // any valid user config options, plus `mode` and `configFile`
    configFile: false,
    root: path.join(__dirname, "..", "..", "vite"),
    server: {
      middlewareMode: true,
    },
    plugins: [react()],
    publicDir: path.join(__dirname, "..", "..", "public"),
  });

  app.use((req, res, next) => {
    server.middlewares.handle(req, res, next);
  });
};

export const startServer = async () => {
  const app = express();

  app.use(bodyParser.json());

  app.post("/api/render", renderEndPoint);

  app.post("/api/progress", progressEndPoint);

  app.get(REDIRECT_URL_ENDPOINT, loginEndPoint);

  if (backendCredentials().NODE_ENV === "development") {
    await startViteDevelopmentServer(app);
  } else {
    const dir = path.join(__dirname, "../../vite/dist");
    app.use(serveStatic(dir));

    app.get("*", (req, response) => {
      const index = path.join(dir, "index.html");
      response.sendFile(index);
    });
  }

  const port = process.env.PORT || 8080;

  app.listen(port);
  console.log(`Listening on http://localhost:${port}`);
};