import fs from "fs-extra";
import path from "path";
import { Api } from "telegram";
import chalk from "chalk";

const LEFT_CACHE_FILE = "cache/left_channels.json";

export const leaveChannels = async (client, chats) => {
  console.log(chalk.blue("\nLeaving channels and groups...\n"));

  let leftChannels = [];
  
  if (await fs.pathExists(LEFT_CACHE_FILE)) {
    leftChannels = await fs.readJson(LEFT_CACHE_FILE);
  }

  for (const chat of chats) {
    if (leftChannels.includes(chat.id)) {
      console.log(chalk.gray(`Skipping ${chat.title} (Already left)`));
      continue;
    }

    try {
      if (chat.is_channel) {
        if (!chat.access_hash) {
          console.warn(chalk.yellow(`Skipping ${chat.title} (No access_hash)`));
          continue;
        }

        await client.invoke(
          new Api.channels.LeaveChannel({
            channel: new Api.InputChannel(chat.id, chat.access_hash),
          })
        );
      } else {
        await client.invoke(
          new Api.messages.DeleteChatUser({
            chat_id: chat.id,
            user_id: "me", 
          })
        );
      }

      console.log(chalk.green(`Successfully left ${chat.title}`));
      leftChannels.push(chat.id); 

      await new Promise((resolve) => setTimeout(resolve, 5000)); 

    } catch (error) {
      console.error(chalk.red(`Failed to leave ${chat.title}: ${error.message}`));

      if (error.message.includes("FLOOD_WAIT")) {
        const waitTime = parseInt(error.message.match(/\d+/)[0]) + 5;
        console.log(chalk.yellow(`Flood wait detected! Sleeping for ${waitTime} seconds...`));
        await new Promise((resolve) => setTimeout(resolve, waitTime * 1000));
      }

      if (error.message.includes("ChatAdminRequired")) {
        console.log(chalk.red(`Cannot leave ${chat.title}, admin rights required!`));
      }
    }
  }

  await fs.writeJson(LEFT_CACHE_FILE, leftChannels, { spaces: 2 });

  console.log(chalk.blue("\nFinished leaving channels.\n"));
};
