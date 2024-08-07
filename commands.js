import { DiscordRequest } from "./utils.js";

export async function HasGuildCommands(appId, guildId, commands) {
  if (guildId === "" || appId === "") return;

  commands.forEach((c) => HasGuildCommand(appId, guildId, c));
}

// Checks for a command
async function HasGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    const res = await DiscordRequest(endpoint, { method: "GET" });
    const data = await res.json();

    if (data) {
      const installedNames = data.map((c) => c["name"]);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command["name"])) {
        console.log(`Installing "${command["name"]}"`);
        InstallGuildCommand(appId, guildId, command);
      } else {
        console.log(`"${command["name"]}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Installs a command
export async function InstallGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  // install command
  try {
    await DiscordRequest(endpoint, { method: "POST", body: command });
  } catch (err) {
    console.error(err);
  }
}

// Start command
export const STOP_COMMAND = {
  name: "stop",
  description: `Stop the ${process.env.SERVICE_NAME} service (if it is running)`,
  type: 1,
};

export const START_COMMAND = {
  name: "start",
  description: `Start the ${process.env.SERVICE_NAME} service (if it is not already running)`,
  type: 1,
};

export const CREATE_COMMAND = {
  name: "create",
  description: `Create an instance of the ${process.env.SERVICE_NAME} service`,
  type: 1,
  options: [
    {
      name: "server_name",
      description: "The name of the server you want to create",
      type: 3,
      required: true,
    },
    {
      name: "version",
      description:
        "The version of the server you want to create. The latest by default",
      type: 3,
    },
  ],
};
