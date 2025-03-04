import { Api } from "telegram";

export const leaveChannels = async (client, chats) => {
  console.log("Leaving selected Channels or Groups...");

  for (const chat of chats) {
    try {
      if (!chat.id || !chat.access_hash) {
        console.warn(`Skipping ${chat.title || "Unknown chat"} due to missing ID or access hash.`);
        continue;
      }

      console.log(`Leaving ${chat.title || "Unknown chat"} (ID: ${chat.id})...`);

      await client.invoke(
        new Api.channels.LeaveChannel({
          channel: new Api.InputChannel({
            channelId: chat.id,
            accessHash: chat.access_hash,
          }),
        })
      );

      console.log(`Successfully left ${chat.title || "Unknown chat"}`);
    } catch (error) {
      console.error(`Failed to leave ${chat.title || "Unknown chat"}: ${error.message}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 60000));
  }

  console.log("Finished leaving all selected channels.");
};
