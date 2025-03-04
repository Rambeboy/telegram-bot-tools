import readline from "readline";
import promptSync from "prompt-sync";

const prompt = promptSync();
const clearLine = () => {
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout, 0);
};

export const showLoginMenu = () => {
  console.log("\n=== LOGIN OPTIONS ===\n");
  console.log("1. Login with API ID & API Hash");
  console.log("2. Login with QR Code");
  console.log("3. Exit");

  process.stdout.write("\nChoose login method (1/2/3) : ");
  const choice = prompt(""); 

  if (choice === "3") {
    console.log("Exiting...");
    process.exit(0);
  }

  if (choice === "1") return "api";
  if (choice === "2") return "qr";

  console.log("Invalid choice. Exiting...");
  process.exit(1);
};
