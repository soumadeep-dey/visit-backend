import { createApp } from "./app";
import { AppDataSource } from "./data-source";
import { env } from "./env";

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("DataSource initialized");

    const app = createApp();
    const port = Number(env.PORT || 8000);
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to initialize", err);
    process.exit(1);
  }
}

main();
