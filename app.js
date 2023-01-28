import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';
import { VerifyDiscordRequest } from './utils.js';
import {
  HasGuildCommands,
  START_COMMAND,
} from './commands.js';
import util from 'util';
import { exec } from 'child_process';

const execP = util.promisify(exec);

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
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
    if (name === 'start') {
      // Check if the Minecraft service is already running
      try {
        await execP('/usr/bin/systemctl status minecraft');
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Minecraft is already running',
          },
        });
      } catch (e) { // If not, start it
        execP('/usr/bin/sudo /usr/bin/systemctl start minecraft');
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Starting Minecraft',
          },
        });
      }
    }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);

  // Check if guild commands from commands.json are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    START_COMMAND,
  ]);
});
