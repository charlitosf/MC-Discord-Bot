import "dotenv/config";
import express from "express";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import { VerifyDiscordRequest } from "./utils.js";
import {
  HasGuildCommands,
  STOP_COMMAND,
  START_COMMAND,
  CREATE_COMMAND,
} from "./commands.js";
import {
  createCommand,
  startCommand,
  stopCommand,
} from "./controllers/application_commands.js";
import {
  finalizeServerCreationCommand,
  selectWorldCommand,
} from "./controllers/message_components.js";

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

const serverCreations = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;
  const { options } = data;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === STOP_COMMAND.name) {
      return await stopCommand(res);
    }

    if (name === START_COMMAND.name) {
      return await startCommand(res);
    }
    if (name === CREATE_COMMAND.name) {
      const serverNameObject = options.find(
        (option) => option.name === "server_name"
      );
      const versionObject = options.find((option) => option.name === "version");

      serverCreations[id] = {
        serverName: serverNameObject.value,
        version: versionObject?.value,
      };
      return await createCommand(res, id);
    }
  }

  if (type === InteractionType.MESSAGE_COMPONENT) {
    // Check if the service is already running
    const { values, custom_id, id } = data;

    if (custom_id === "world_select") {
      return await selectWorldCommand(res, values);
    }

    if (custom_id.startsWith("template_select_")) {
      const id = custom_id.replace("template_select_", "");
      const { serverName, version } = serverCreations[id];
      const templateName = values[0];
      return await finalizeServerCreationCommand(
        res,
        serverName,
        templateName,
        version
      );
    }
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);

  // Check if guild commands from commands.json are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    START_COMMAND,
    STOP_COMMAND,
    CREATE_COMMAND,
  ]);
});
