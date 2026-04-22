import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./shared/logger/logger";

app.listen(env.PORT, () => {
  logger.info(`API running on port ${env.PORT}`);
});
