import fs from "fs-extra";
import path from "path";
import { Api } from "telegram";
import chalk from "chalk";
import Table from "cli-table3"; 

const CACHE_FILE = path.join("cache", "chats.json");

export const getChats = async (client) => {
  console.log(chalk.green("\nFetching Channel and Group list..."));

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

    const table = new Table({
      head: [chalk.blue("No"), chalk.blue("Title"), chalk.blue("Type"), chalk.blue("ID"), chalk.blue("Access Hash")],
      colWidths: [5, 30, 10, 20, 20],
    });

    chats.forEach((chat, index) => {
      table.push([
        index + 1,
        chat.title.length > 25 ? chat.title.slice(0, 25) + "..." : chat.title,
        chat.is_channel ? "Channel" : "Group",
        chat.id,
        chat.access_hash || "N/A",
      ]);
    });

    console.log(table.toString()); 

    console.log("DEBUG: getChats function finished executing.");
    return chats;
  } catch (error) {
    console.error(chalk.red("Error fetching chats:", error.message));
    return [];
  }
};
