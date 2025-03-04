import fs from "fs-extra";
import path from "path";
import { Api } from "telegram";
import chalk from "chalk";

const CACHE_FILE = path.join("cache", "chats.json");
export const getChats = async (client) => {
  console.log(chalk.green("\nFetching Channel and Group list..."));
  if (await fs.pathExists(CACHE_FILE)) {
    console.log("Loading chats from cache...");
    return await fs.readJson(CACHE_FILE);
  }

  try {
    const dialogs = await client.getDialogs();
    const chats = dialogs
      .map((dialog) => dialog.entity)
      .filter((chat) => chat?.className === "Channel" || chat?.className === "Chat")
      .map((chat) => ({
        id: chat.id,
        title: chat.title || "Unknown",
        access_hash: chat.accessHash || null,
        is_channel: chat.className === "Channel",
      }));

    if (chats.length === 0) {
      console.log(chalk.red("No Channels or Groups found."));
      return [];
    }

    await fs.ensureDir("cache");
    await fs.writeJson(CACHE_FILE, chats, { spaces: 2 });
    console.log(chalk.yellow("Chats cached successfully!"));

    chats.forEach((chat, index) => {
      console.log(`${index + 1}. ${chat.title} (ID: ${chat.id})`);
    });

    return chats;
  } catch (error) {
    console.error(chalk.red("Error fetching chats :", error.message));
    return [];
  }
};
