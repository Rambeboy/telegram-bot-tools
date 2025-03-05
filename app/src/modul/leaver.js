import fs from "fs-extra";
import path from "path";
import { Api } from "telegram";
import chalk from "chalk";

const CACHE_FILE = path.join("cache", "chats.json");

export const leaveChannels = async (client, chats) => {
  console.log(chalk.yellow("\nLeaving selected Channels or Groups..."));

  let updatedChats = [...chats]; 

  for (const chat of chats) {
    try {
      if (!chat.access_hash) {
        console.warn(chalk.red(`Skipping ${chat.title} due to missing access hash.`));
        continue;
      }

      await client.invoke(
        new Api.channels.LeaveChannel({
          channel: new Api.InputChannel(chat.id, chat.access_hash),
        })
      );

      console.log(chalk.green(`Successfully left ${chat.title}`));
      updatedChats = updatedChats.filter((c) => c.id !== chat.id);
      await fs.writeJson(CACHE_FILE, updatedChats, { spaces: 2 });
    } catch (error) {
      console.error(chalk.red(`Failed to leave ${chat.title}: ${error.message}`));
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};
