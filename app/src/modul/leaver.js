import { Api } from "telegram";

export const leaveChannels = async (client, chats) => {
  console.log("Leaving selected Channels or Groups...");

  for (const chat of chats) {
    try {
      if (!chat.access_hash) {
        console.warn(`Skipping ${chat.title} due to missing access hash.`);
        continue;
      }

      await client.invoke(
        new Api.channels.LeaveChannel({
          channel: new Api.InputChannel(chat.id, chat.access_hash),
        })
      );

      console.log(`Successfully left ${chat.title}`);
    } catch (error) {
      console.error(`Failed to leave ${chat.title}: ${error.message}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 60000));
  }
};