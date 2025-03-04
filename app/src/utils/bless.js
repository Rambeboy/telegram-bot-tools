import readline from "readline";
import promptSync from "prompt-sync";
import { getChats } from "../modul/scraper.js";
import { joinChannels } from "../modul/joiner.js";
import { leaveChannels } from "../modul/leaver.js";
import { Api } from "telegram";

const prompt = promptSync();

// Fungsi untuk menghapus baris sebelumnya agar teks tidak turun ke bawah
const clearLine = () => {
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout, 0);
};

export const showToolsMenu = async (client) => {
  while (true) {
    console.log("\n=== TELEGRAM TOOLS MENU ===\n");
    console.log("1. View Channel & Group list");
    console.log("2. Auto join Channel Based on Keyword");
    console.log("3. Exit Channel or Groups");
    console.log("4. Logout & Exit");
    process.stdout.write("\nEnter your choice (1/2/3/4) : ");
    clearLine(); 
    const choice = prompt("");  

    if (choice === "1") {
      await getChats(client);
    } else if (choice === "2") {
      process.stdout.write("Enter the Channel Search Keyword : ");
      clearLine();
      const keyword = prompt("");
      await joinChannels(client, keyword);
    } else if (choice === "3") {
      const chats = await getChats(client);
      await leaveChannels(client, chats);
    } else if (choice === "4") {
      if (client.connected) {
        console.log("Logging out...");
        await client.invoke(new Api.auth.LogOut()); 
        console.log("Logged out successfully!");
      } else {
        console.log("Client is not connected. Cannot log out.");
      }
      break;
    } else {
      console.log("Invalid selection. Please choose a valid option.");
    }
  }

  await client.disconnect();
  console.log("Exiting...");
};
