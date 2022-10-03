import { Frame } from "./types";
import { FrameClient } from "./frame";
import chalk from "chalk";
import { loadScript } from "./utils";
import path from "path";
import watch from "node-watch";

const frame = new FrameClient(Frame.SP);

frame.on("connected", async (client: FrameClient) => {
  const script = loadScript("../frontend/dist/index.js");

  await client.injectScript(script);

  client.CDP.on("Page.loadEventFired", async () => {
    await client.injectScript(script);
  });

  watch(
    path.join(__dirname, "../frontend/dist"),
    { recursive: true },
    async () => {
      console.log(chalk.magentaBright("Hot reloading..."));
      const script = loadScript("../frontend/dist/index.js");
      await client.injectScript(script);
    }
  );
});

frame.on("disconnected", (client) => {
  client.CDP.close();
});

process.on("SIGINT", () => {
  console.log("Closing CDP...");

  if (frame.CDP) {
    frame.CDP.close();
  }

  process.exit();
});
