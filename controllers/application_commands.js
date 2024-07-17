import {
  InteractionResponseType,
  MessageComponentTypes,
} from "discord-interactions";
import {
  checkServiceStarted,
  getTemplateNamesAsOptions,
  getWorldsAsOptions,
  stopService,
} from "../osInteractions.js";

export async function stopCommand(res) {
  await stopService();
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `Stopping ${process.env.SERVICE_NAME}...`,
    },
  });
}

export async function startCommand(res) {
  try {
    await checkServiceStarted();
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `${process.env.SERVICE_NAME} is already running`,
      },
    });
  } catch (e) {
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

export async function createCommand(res, createId) {
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: "Choose the template you want to create the server from:",
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.STRING_SELECT,
              custom_id: `template_select_${createId}`,
              options: await getTemplateNamesAsOptions(),
            },
          ],
        },
      ],
    },
  });
}
