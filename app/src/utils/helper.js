import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });

export const showLoginMenu = () => {
  console.log("\n======== LOGIN OPTIONS ========\n");
  console.log("1. Login with API ID & API Hash");
  console.log("2. Login with QR Code");
  console.log("3. Exit\n");
  const choice = prompt("Choose login method (1/2/3) : ").trim(); 

  if (choice === "3") {
    console.log("Exiting...");
    process.exit(0);
  }

  if (choice === "1") return "api";
  if (choice === "2") return "qr";

  console.log("Invalid choice. Exiting...");
  process.exit(1);
};
