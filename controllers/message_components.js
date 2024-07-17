import {
  InteractionResponseType,
  MessageComponentTypes,
} from "discord-interactions";
import {
  createServerFromTemplate,
  selectWorld,
  startService,
} from "../osInteractions.js";

export async function selectWorldCommand(res, values) {
  const BANNED_CHARACTERS_REGEX = /[^a-zA-Z0-9_\.-]/g;
  const selected_world = values[0].replaceAll(BANNED_CHARACTERS_REGEX, "");

  await selectWorld(selected_world);
  await startService();

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `Starting world: ${selected_world}...`,
    },
  });
}

export async function finalizeServerCreationCommand(
  res,
  serverName,
  templateName,
  version
) {
  version = await createServerFromTemplate(templateName, serverName, version);
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `Creating server from template: ${templateName} and version: ${version}...`,
    },
  });
}
