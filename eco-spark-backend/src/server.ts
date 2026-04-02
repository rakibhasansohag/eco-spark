import { createServer } from "http";
import app from "./app.js";
import { envVars } from "./app/config/env.js";

const server = createServer(app);

async function bootstrap() {
  server.listen(envVars.PORT, () => {
    console.info(`EcoSpark Hub server running on port ${envVars.PORT}`);
  });

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    server.close(() => process.exit(1));
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
  });
}

bootstrap();
