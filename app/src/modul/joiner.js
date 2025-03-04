import { Api } from "telegram";

export const joinChannels = async (client, keyword) => {
  console.log(`Searching for channels with keyword: "${keyword}"...`);

  const result = await client.invoke(
    new Api.contacts.Search({ q: keyword, limit: 10 })
  );

  if (!result.chats.length) {
    console.log("No channels found with the given keyword.");
    return;
  }

  console.log("Channels found:");
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
      console.log(`Successfully joined ${chat.title}`);
    } catch (error) {
      console.error(`Failed to join ${chat.title}: ${error.message}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 60000));
  }
};