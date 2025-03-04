import { Api } from "telegram";

let cachedChats = null;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const getChats = async (client, forceRefresh = false) => {
  if (!forceRefresh && cachedChats) {
    console.log("Using cached chat list...");
    return cachedChats;
  }

  console.log("\nFetching Channel and Group list...");
  try {
    const dialogs = await client.getDialogs();
    const chats = [];

    for (const dialog of dialogs) {
      const entity = dialog.entity;

      if (entity instanceof Api.Channel || entity instanceof Api.Chat) {
        try {
          await sleep(2000);
          const fullEntity = await client.invoke(new Api.channels.GetFullChannel({
            channel: entity,
          }));

          if (fullEntity.full_chat && !fullEntity.full_chat.access_hash) {
            console.warn(`Skipping ${entity.title} (ID: ${entity.id}) due to missing access_hash.`);
            continue;
          }

          chats.push({
            id: entity.id,
            access_hash: fullEntity.full_chat?.access_hash || null,
            title: entity.title || "Unknown",
          });

        } catch (error) {
          console.error(`Failed to get details for ${entity.title}: ${error.message}`);
        }
      }
    }

    if (chats.length === 0) {
      console.log("No Channels or Groups found.");
      return [];
    }

    chats.forEach((chat, index) => {
      console.log(`${index + 1}. ${chat.title} (ID: ${chat.id})`);
    });
    
    cachedChats = chats;

    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error.message);
    return [];
  }
};
