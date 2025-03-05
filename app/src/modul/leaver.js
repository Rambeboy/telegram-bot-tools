import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { Api } from "telegram";

const LOGGED_OUT_FILE = path.join("cache", "logged_out.json");

export const leaveChannels = async (client, chats) => {
  if (!chats || chats.length === 0) {
    console.log(chalk.red("No channels or groups available to leave."));
    return;
  }

  console.log(chalk.yellow("\nStarting to leave channels/groups..."));

  let loggedOutChats = [];
  if (await fs.pathExists(LOGGED_OUT_FILE)) {
    loggedOutChats = await fs.readJson(LOGGED_OUT_FILE);
  }

  for (const chat of chats) {
    if (loggedOutChats.includes(chat.id)) {
      console.log(chalk.gray(`Skipping ${chat.title} (Already left)`));
      continue;
    }

    try {
      if (!chat.access_hash) {
        console.log(chalk.red(`Skipping ${chat.title} (Missing access_hash)`));
        continue;
      }

      await client.invoke(new Api.channels.LeaveChannel({
        channel: chat.id
      }));

      console.log(chalk.green(`Successfully left ${chat.title}`));

      loggedOutChats.push(chat.id);
      await fs.writeJson(LOGGED_OUT_FILE, loggedOutChats, { spaces: 2 });

    } catch (error) {
      console.error(chalk.red(`Failed to leave ${chat.title}: ${error.message}`));
    }
  }

  console.log(chalk.yellow("\nFinished leaving channels/groups."));
};
