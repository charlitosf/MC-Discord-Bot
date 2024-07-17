const RELEASES_URL =
  "https://launchermeta.mojang.com/mc/game/version_manifest.json";

export async function getReleaseUrl(releaseId) {
  const data = await fetch(RELEASES_URL);
  const json = await data.json();
  if (releaseId === undefined) {
    releaseId = json.latest.release;
  }
  const basicReleaseData = json.versions.find(
    (version) => version.id === releaseId
  );
  const releaseData = await fetch(basicReleaseData.url);
  const releaseDataJson = await releaseData.json();
  const releaseUrl = releaseDataJson.downloads.server.url;
  return { url: releaseUrl, version: releaseId };
}
