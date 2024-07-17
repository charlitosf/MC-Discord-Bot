import { exec } from "child_process";
import util from "util";
import fs from "node:fs/promises";
import { getReleaseUrl } from "./version_manager.js";

const execAsPromise = util.promisify(exec);

export async function getWorldsAsOptions() {
  const output = await execAsPromise(
    `ls -d ${process.env.WORKING_DIRECOTORY}*/`
  );
  const directories = output.stdout
    .trim()
    .split("\n")
    .map((directory) =>
      directory.replace(process.env.WORKING_DIRECOTORY, "").replace("/", "")
    );

  return directories.map((dir) => {
    return {
      label: dir,
      value: dir,
    };
  });
}

export async function selectWorld(worldName) {
  return await fs.writeFile(
    `${process.env.WORKING_DIRECOTORY}${process.env.CURRENT_SERVER_FILE_NAME}`,
    worldName
  );
}

export async function checkServiceStarted() {
  await execAsPromise(`/usr/bin/systemctl status ${process.env.SERVICE_NAME}`);
}

export async function startService() {
  await execAsPromise(
    `/usr/bin/sudo /usr/bin/systemctl start ${process.env.SERVICE_NAME}`
  );
}

export async function stopService() {
  await execAsPromise(
    `/usr/bin/sudo /usr/bin/systemctl stop ${process.env.SERVICE_NAME}`
  );
}

export async function createServerFromTemplate(
  templateName,
  serverName,
  versionId
) {
  const { url, version } = await getReleaseUrl(versionId);
  await createServer(templateName, serverName, url);
  return version;
}

async function createServer(templateName, serverName, serverUrl) {
  await execAsPromise(
    `cp -r ${process.env.TEMPLATES_DIRECTORY}${templateName} ${process.env.WORKING_DIRECOTORY}${serverName}`
  );
  downloadWorld(serverName, serverUrl);
}

function downloadWorld(serverName, url) {
  execAsPromise(
    `wget -O ${process.env.WORKING_DIRECOTORY}${serverName}/server.jar ${url}`
  );
}

export async function getTemplateNamesAsOptions() {
  const output = await execAsPromise(`ls ${process.env.TEMPLATES_DIRECTORY}`);
  return output.stdout
    .trim()
    .split("\n")
    .map((dir) => {
      return {
        label: dir,
        value: dir,
      };
    });
}
