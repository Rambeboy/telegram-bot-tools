import fs from "fs-extra";
import path from "path";
import { Api } from "telegram";
import chalk from "chalk";

const LEFT_CACHE_FILE = path.join("cache", "left_channels.json"); // Cache untuk channel yang sudah ditinggalkan

export const leaveChannels = async (client, chats) => {
  console.log(chalk.blue("\nLeaving channels and groups...\n"));

  let leftChannels = [];
  
  // Cek apakah ada cache channel yang sudah ditinggalkan
  if (await fs.pathExists(LEFT_CACHE_FILE)) {
    leftChannels = await fs.readJson(LEFT_CACHE_FILE);
  }

  for (const chat of chats) {
    // **Cek apakah sudah pernah keluar dari channel ini**
    if (leftChannels.includes(chat.id)) {
      console.log(chalk.gray(`Skipping ${chat.title} (Already left)`));
      continue; // Lewati channel ini
    }

    // **Cek access_hash, jika tidak ada -> skip**
    if (!chat.access_hash) {
      console.warn(chalk.yellow(`Skipping ${chat.title} (Missing access hash)`));
      continue;
    }

    try {
      await client.invoke(
        new Api.channels.LeaveChannel({
          channel: new Api.InputChannel(chat.id, chat.access_hash),
        })
      );

      console.log(chalk.green(`✅ Successfully left ${chat.title}`));
      leftChannels.push(chat.id); // Simpan channel yang sudah ditinggalkan

      // **Delay untuk menghindari flood wait**
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 detik delay

    } catch (error) {
      console.error(chalk.red(`❌ Failed to leave ${chat.title}: ${error.message}`));

      // Jika terkena flood wait, berikan waktu istirahat sebelum lanjut
      if (error.message.includes("FLOOD_WAIT")) {
        const waitTime = parseInt(error.message.match(/\d+/)[0]) + 5; // Tambah 5 detik agar aman
        console.log(chalk.yellow(`⏳ Flood wait detected! Sleeping for ${waitTime} seconds...`));
        await new Promise((resolve) => setTimeout(resolve, waitTime * 1000));
      }
    }
  }

  // **Simpan daftar channel yang sudah ditinggalkan agar tidak keluar lagi**
  await fs.writeJson(LEFT_CACHE_FILE, leftChannels, { spaces: 2 });

  console.log(chalk.blue("\nFinished leaving channels.\n"));
};
