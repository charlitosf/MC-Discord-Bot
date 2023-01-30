# MC-Discord-Bot

This is a NodeJS with Express project of a Discord bot. It features a single command to start a Linux service in the same machine the bot is running.

## Project structure

- [app.js](https://github.com/charlitosf/MC-Discord-Bot/blob/main/app.js): Entry-point of the application. It contains the Express code to handle incoming requests and the execution of the command in the current machine.
- [commands.js](https://github.com/charlitosf/MC-Discord-Bot/blob/main/commands.js): Functions related to the management of the Discord commands.
- [utils.js](https://github.com/charlitosf/MC-Discord-Bot/blob/main/utils.js): Utility functions related to the Bot-Discord communication.

## Running app locally

Before you start, you'll need to [create a Discord app](https://discord.com/developers/applications) with the proper permissions:
- `applications.commands`
- `bot` (with Send Messages enabled)

Configuring the app is covered in detail in the [getting started guide](https://discord.com/developers/docs/getting-started).

Then, a Linux service must be configured ([documentation](https://wiki.archlinux.org/title/systemd#Writing_unit_files)).

### Setup project

First clone the project:
```bash
git clone https://github.com/charlitosf/MC-Discord-Bot
```

Then navigate to its directory and install dependencies:
```
cd discord-example-app
npm install
```

### Get app credentials

Fetch the credentials from your app's settings and add them to a `.env` file (see `.env.sample` for an example). You'll need your app ID (`APP_ID`), server ID (`GUILD_ID`), bot token (`DISCORD_TOKEN`), and public key (`PUBLIC_KEY`).

Fetching credentials is covered in detail in the [getting started guide](https://discord.com/developers/docs/getting-started).

### Run the app

After your credentials are added, go ahead and run the app:

```
node app.js
```

> ⚙️ A package [like `nodemon`](https://github.com/remy/nodemon), which watches for local changes and restarts your app, may be helpful while locally developing.

### Set up interactivity

The project needs a public endpoint where Discord can send requests. To develop and test locally, you can use something like [`ngrok`](https://ngrok.com/) to tunnel HTTP traffic.

> As an alternative, you can set up a reverse proxy server with Nginx, Apache or other and set up HTTPS with a proper certificate such as one provided by [Letsencrypt](https://letsencrypt.org/).

Install ngrok if you haven't already, then start listening on port `3000`:

```
ngrok http 3000
```

You should see your connection open:

```
Tunnel Status                 online
Version                       2.0/2.0
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://1234-someurl.ngrok.io -> localhost:3000
Forwarding                    https://1234-someurl.ngrok.io -> localhost:3000

Connections                  ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

Copy the forwarding address that starts with `https`, in this case `https://1234-someurl.ngrok.io`, then go to your [app's settings](https://discord.com/developers/applications).

On the **General Information** tab, there will be an **Interactions Endpoint URL**. Paste your ngrok address there, and append `/interactions` to it (`https://1234-someurl.ngrok.io/interactions` in the example).

Click **Save Changes**, and your app should be ready to run 🚀
