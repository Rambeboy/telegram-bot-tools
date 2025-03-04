import { showBanner } from "./src/utils/twist.js";
import { showLoginMenu } from "./src/utils/helper.js";
import { getClient } from "./src/telegram/client.js";
import { showToolsMenu } from "./src/utils/bless.js";

(async () => {
  try {
    showBanner();

    const loginMethod = showLoginMenu();
    const client = await getClient(loginMethod);

    await showToolsMenu(client);
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();