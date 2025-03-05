import fs from "fs-extra";
import path from "path";
import { Api } from "telegram";
import chalk from "chalk";

const CACHE_FILE = path.join("cache", "chats.json");

export const getChats = async (client) => {
  console.log(chalk.green("\nFetching Channel and Group list..."));

  // Hapus cache jika perlu debugging
  if (await fs.pathExists(CACHE_FILE)) {
    console.log(chalk.green("Loading chats from cache..."));
    return await fs.readJson(CACHE_FILE);
  }

  try {
    console.log("DEBUG: Requesting dialogs from Telegram...");
    
    const dialogs = [];
    for await (const dialog of client.iterDialogs({})) {
      dialogs.push(dialog);
    }
    
    console.log(`DEBUG: Retrieved ${dialogs.length} dialogs from Telegram.`);

    if (dialogs.length === 0) {
      console.log(chalk.red("No Channels or Groups found."));
      return [];
    }

    const chats = dialogs
      .map((dialog) => dialog.entity)
      .filter((chat) => chat?.className === "Channel" || chat?.className === "Chat")
      .map((chat) => ({
        id: chat.id,
        title: chat.title || "Unknown",
        access_hash: chat.access_hash ?? null,
        is_channel: chat.className === "Channel",
      }));

    if (chats.length === 0) {
      console.log(chalk.red("No valid Channels or Groups found."));
      return [];
    }

    await fs.ensureDir("cache");
    await fs.writeJson(CACHE_FILE, chats, { spaces: 2 });
    console.log(chalk.yellow("Chats cached successfully!"));

    chats.forEach((chat, index) => {
      console.log(`${index + 1}. ${chat.title.padEnd(30)} | ID: ${chat.id} | Hash: ${chat.access_hash}`);
    });

    console.log("DEBUG: getChats function finished executing.");
    return chats;
  } catch (error) {
    console.error(chalk.red("Error fetching chats:", error.message));
    return [];
  }
};
