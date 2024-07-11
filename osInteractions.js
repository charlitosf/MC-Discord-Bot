import { exec } from "child_process";
import util from "util";

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

export async function checkServiceStarted() {
  await execAsPromise(`/usr/bin/systemctl status ${process.env.SERVICE}`);
}

export async function startService() {
  await execAsPromise(
    `/usr/bin/sudo /usr/bin/systemctl start ${process.env.SERVICE_NAME}`
  );
}
