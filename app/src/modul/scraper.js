import { Api } from "telegram";

export const getChats = async (client) => {
  console.log("\nFetching Channel and Group list...");

  try {
    const dialogs = await client.getDialogs();
    const chats = [];

    for (const dialog of dialogs) {
      const entity = dialog.entity;

      if (entity instanceof Api.Channel || entity instanceof Api.Chat) {
        try {
          const fullEntity = await client.getEntity(entity.id);
          if (fullEntity instanceof Api.Channel && !fullEntity.access_hash) {
            console.warn(`Skipping ${fullEntity.title} (ID: ${fullEntity.id}) due to missing access_hash.`);
            continue;
          }

          chats.push({
            id: fullEntity.id,
            access_hash: fullEntity.access_hash || null,
            title: fullEntity.title || "Unknown",
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

    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error.message);
    return [];
  }
};
