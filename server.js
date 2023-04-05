import http from "http";

import app from "./src/app.js";
import config from "./src/utils/config.js";
import logger from "./src/utils/log.js";

const log = logger("server");
const server = http.createServer(app);

process.on("uncaughtException", (err) => {
  log.fatal({ err }, `Unhandled exception ${err}`);
  server.close();
});

process.on("unhandledRejection", (reason) => {
  log.error(`Unhandled promise rejection: ${reason}`);
});

const main = async () => {
  log.info(`Listening on 0.0.0.0:${config.PORT}`);
  await server.listen(config.PORT);
};

main();
