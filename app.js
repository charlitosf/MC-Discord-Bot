import "dotenv/config";
import express from "express";
import {
  InteractionType,
  InteractionResponseType,
  MessageComponentTypes,
} from "discord-interactions";
import { VerifyDiscordRequest } from "./utils.js";
import {
  HasGuildCommands,
  START_COMMAND,
  START_COMMAND_TEST,
} from "./commands.js";
import util from "util";
import { exec } from "child_process";
import { getWorldsAsOptions } from "./osInteractions.js";

const execAsPromise = util.promisify(exec);

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "start" guild command
    if (name === "start") {
      // Check if the service is already running
      try {
        await execAsPromise(`/usr/bin/systemctl status ${process.env.SERVICE}`);
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `${process.env.SERVICE_NAME} is already running`,
          },
        });
      } catch (e) {
        // If not, start it
        execAsPromise(
          `/usr/bin/sudo /usr/bin/systemctl start ${process.env.SERVICE_NAME}`
        );
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Starting ${process.env.SERVICE_NAME}...`,
          },
        });
      }
    }

    if (name === "start-test") {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "Choose the world you want to start:",
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.STRING_SELECT,
                  custom_id: "world_select",
                  options: await getWorldsAsOptions(),
                },
              ],
            },
          ],
        },
      });
    }
  }

  if (type === InteractionType.MESSAGE_COMPONENT) {
    const { values: selected_world } = data;

    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `Starting the specific world: ${selected_world}...`,
      },
    });
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);

  // Check if guild commands from commands.json are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    START_COMMAND,
    START_COMMAND_TEST,
  ]);
});
