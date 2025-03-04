import promptSync from "prompt-sync";
import { getChats } from "../modul/scraper.js";
import { joinChannels } from "../modul/joiner.js";
import { leaveChannels } from "../modul/leaver.js";

const prompt = promptSync();

export const showToolsMenu = async (client) => {
  while (true) {
    console.log("\n=== TELEGRAM TOOLS MENU ===\n");
    console.log("1. View Channel & Group list");
    console.log("2. Auto join Channel based on keyword");
    console.log("3. Exit Channel or Group");
    console.log("4. Logout & Exit");

    const choice = prompt("\nEnter your choice (1/2/3/4) : ");

    if (choice === "1") {
      await getChats(client);
    } else if (choice === "2") {
      const keyword = prompt("Enter the channel search keyword : ");
      await joinChannels(client, keyword);
    } else if (choice === "3") {
      const chats = await getChats(client);
      await leaveChannels(client, chats);
    } else if (choice === "4") {
      console.log("Logging out...");
      await client.logOut();
      console.log("Logged out successfully!");
      break;
    } else {
      console.log("Invalid selection. Please choose a valid option.");
    }
  }

  await client.disconnect();
  console.log("Exiting...");
};
