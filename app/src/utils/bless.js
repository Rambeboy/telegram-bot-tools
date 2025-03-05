import promptSync from "prompt-sync";
import { getChats } from "../modul/scraper.js";
import { joinChannels } from "../modul/joiner.js";
import { leaveChannels } from "../modul/leaver.js";
import { Api } from "telegram";
import chalk from "chalk";
import Table from "cli-table3";

const prompt = promptSync({ sigint: true });

export const showToolsMenu = async (client) => {
  while (true) {
    console.log(chalk.blue("\n===== TELEGRAM TOOLS MENU =====\n"));
    console.log(chalk.yellow("1. View Channel & Group List"));
    console.log(chalk.green("2. Auto Join Channel Based on Keyword"));
    console.log(chalk.red("3. Exit Channel or Groups"));
    console.log(chalk.magenta("4. Logout & Exit"));
    console.log();

    const choice = prompt(chalk.cyan("Enter your choice (1/2/3/4): ")).trim();

    if (choice === "1") {
      console.log(chalk.green("DEBUG: getChats function is called."));
      const chats = await getChats(client);

      if (chats.length === 0) {
        console.log(chalk.red("No Channels or Groups found."));
        continue;
      }

      console.log(chalk.green("\n=== Channel & Group List ===\n"));

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

      console.log(chalk.green("DEBUG: getChats function returned successfully."));

    } else if (choice === "2") {
      const keyword = prompt(chalk.cyan("Enter the Channel Search Keyword: ")).trim();
      await joinChannels(client, keyword);

    } else if (choice === "3") {
      const chats = await getChats(client);
      if (chats.length === 0) {
        console.log(chalk.red("No Channels or Groups available to leave."));
        continue;
      }
      await leaveChannels(client, chats);

    } else if (choice === "4") {
      if (client.connected) {
        console.log(chalk.yellow("Logging out..."));
        await client.invoke(new Api.auth.LogOut());
        console.log(chalk.green("Logged out successfully!"));
      } else {
        console.log(chalk.red("Client is not connected. Cannot log out."));
      }
      break;

    } else {
      console.log(chalk.red("Invalid selection. Please choose a valid option."));
    }
  }

  await client.disconnect();
  console.log(chalk.blue("Exiting..."));
};
