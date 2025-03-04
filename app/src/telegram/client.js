import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import fs from "fs-extra";
import input from "input";
import qrcode from "qrcode-terminal";
import { Config } from "../../config/config.js";

const SESSION_FILE = "session.json";

export const getClient = async (loginMethod) => {
  let session = fs.existsSync(SESSION_FILE) ? fs.readFileSync(SESSION_FILE, "utf-8") : "";

  const { TELEGRAM_APP_ID, TELEGRAM_APP_HASH } = Config;

  if (!TELEGRAM_APP_ID || !TELEGRAM_APP_HASH) {
    console.error("Error: TELEGRAM_APP_ID or TELEGRAM_APP_HASH is not set in config.");
    process.exit(1);
  }

  const client = new TelegramClient(new StringSession(session), TELEGRAM_APP_ID, TELEGRAM_APP_HASH, {
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
      if (!qrLogin || !qrLogin.url) {
        console.error("Failed to generate QR Code.");
        process.exit(1);
      }

      qrcode.generate(qrLogin.url, { small: true });
      console.log("Scan this QR Code with your Telegram app.");

      await qrLogin.wait();
      console.log("Successfully logged in using QR Code.");
    } else {
      console.error("Invalid login method.");
      process.exit(1);
    }

    if (client.connected) {
      fs.writeFileSync(SESSION_FILE, client.session.save());
      console.log("Session successfully saved.");
    } else {
      console.error("Failed to save session. Client is not connected.");
      process.exit(1);
    }

    return client;
  } catch (error) {
    console.error("An error occurred during login:", error);
    process.exit(1);
  }
};
