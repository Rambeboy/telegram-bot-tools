export const getChats = async (client) => {
  console.log("Fetching Channel and Group list...");
  
  try {
    const dialogs = await client.getDialogs();
    const chats = dialogs
      .map((dialog) => dialog.entity)
      .filter((chat) => chat?.className === "Channel" || chat?.className === "Chat");

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