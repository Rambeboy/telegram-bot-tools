import { readFileSync, writeFileSync, existsSync, unlinkSync } from "fs";

const SESSION_FILE = "session.json";

export const saveSession = (session) => {
  try {
    writeFileSync(SESSION_FILE, session);
    console.log("Session has been saved successfully.");
  } catch (error) {
    console.error("Failed to save session:", error);
  }
};

export const loadSession = () => {
  try {
    if (existsSync(SESSION_FILE)) {
      return readFileSync(SESSION_FILE, "utf-8");
    }
  } catch (error) {
    console.error("Failed to load session:", error);
  }
  return "";
};

export const deleteSession = () => {
  try {
    if (existsSync(SESSION_FILE)) {
      unlinkSync(SESSION_FILE);
      console.log("Telegram session has been deleted.");
    }
  } catch (error) {
    console.error("Failed to delete session:", error);
  }
};
