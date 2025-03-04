import { Api } from "telegram";
import chalk from "chalk";

export const leaveChannels = async (client, chats) => {
  console.log(chalk.green("\nLeaving selected Channels or Groups..."));

  for (const chat of chats) {
    try {
      if (!chat.access_hash) {
        console.warn(chalk.yellow(`Skipping ${chat.title} Due to missing access hash.`));
        continue;
      }

      await client.invoke(
        new Api.channels.LeaveChannel({
          channel: new Api.InputChannel(chat.id, chat.access_hash),
        })
      );

      console.log(chalk.yellow(`Successfully left ${chat.title}`)); 
    } catch (error) {
      console.error(chalk.red(`Failed to leave ${chat.title}: ${error.message}`)); 
    }
    await new Promise((resolve) => setTimeout(resolve, 60000));
  }
};
