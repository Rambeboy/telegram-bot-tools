import { Api } from "telegram";

export const showToolsMenu = async (client) => {
  while (true) {
    console.log("\n=== TELEGRAM TOOLS MENU ===\n");
    console.log("1. View Channel & Group list");
    console.log("2. Auto join Channel Based on Keyword");
    console.log("3. Exit Channel or Groups");
    console.log("4. Logout & Exit");
    const choice = prompt("\nEnter your choice (1/2/3/4) : ");

    if (choice === "1") {
      await getChats(client);
    } else if (choice === "2") {
      const keyword = prompt("Enter the Channel search keyword : ");
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
