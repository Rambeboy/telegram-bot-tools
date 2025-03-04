import { Api } from "telegram";
import chalk from "chalk";

export const joinChannels = async (client, keyword) => {
  console.log(chalk.green(`\Searching for Channels with Keyword: "${keyword}"...`));

  const result = await client.invoke(
    new Api.contacts.Search({ q: keyword, limit: 10 })
  );

  if (!result.chats.length) {
    console.log(chalk.red("No Channels found with the given Keyword."));
    return;
  }

  console.log(chalk.yellow("Channels found:"));
  result.chats.forEach((chat, index) => {
    console.log(`${index + 1}. ${chat.title} (ID: ${chat.id})`);
  });

  for (const chat of result.chats) {
    try {
      if (!chat.access_hash) {
        console.warn(`Skipping ${chat.title} due to missing access hash.`);
        continue;
      }

      await client.invoke(
        new Api.channels.JoinChannel({
          channel: new Api.InputChannel(chat.id, chat.access_hash),
        })
      );
      console.log(chalk.yellow(`Successfully joined ${chat.title}`));
    } catch (error) {
      console.error(chalk.red(`Failed to join ${chat.title}: ${error.message}`));
    }

    await new Promise((resolve) => setTimeout(resolve, 60000));
  }
};
