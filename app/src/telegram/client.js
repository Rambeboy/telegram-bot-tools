import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import fs from "fs-extra";
import input from "input";
import qrcode from "qrcode-terminal";
import { config } from "../../config/config.js";

const SESSION_FILE = "session.json";

export const getClient = async (loginMethod) => {
  let session = "";

  if (fs.existsSync(SESSION_FILE)) {
    session = fs.readFileSync(SESSION_FILE, "utf-8");
  }

  const client = new TelegramClient(new StringSession(session), config.apiId, config.apiHash, {
    connectionRetries: 5,
  });

  try {
    if (loginMethod === "api") {
      console.log("\nLogging in with API ID & API Hash...");
      await client.start({
        phoneNumber: async () => await input.text("Enter your phone number (e.g., +62xxxx) : "),
        password: async () => await input.text("Enter your two-step verification password (if any) : "),
        phoneCode: async () => await input.text("Enter the OTP code sent to your Telegram : "),
        onError: (err) => console.error("Error:", err),
      });
    } else if (loginMethod === "qr") {
      console.log("\nLogging in with QR Code...");
      await client.connect();

      const qrLogin = await client.qrLogin();
      qrcode.generate(qrLogin.url, { small: true });
      console.log("Scan this QR Code with your Telegram app.");

      await qrLogin.wait();
      console.log("Successfully logged in using QR Code.");
    } else {
      console.log("Invalid login method.");
      process.exit(1);
    }

    if (client.connected) {
      fs.writeFileSync(SESSION_FILE, client.session.save());
      console.log("Session successfully saved.");
    } else {
      console.log("Failed to save session. Client is not connected.");
    }

    return client;
  } catch (error) {
    console.error("An error occurred during login:", error);
    process.exit(1);
  }
};