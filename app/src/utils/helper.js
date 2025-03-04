import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true }); // Menghindari crash saat Ctrl+C

export const showLoginMenu = () => {
  console.log("\n=== LOGIN OPTIONS ===\n");
  console.log("1. Login with API ID & API Hash");
  console.log("2. Login with QR Code");
  console.log("3. Exit");

  // Menampilkan teks tanpa pindah baris
  process.stdout.write("\nChoose login method (1/2/3): ");
  const choice = prompt().trim();; // Tidak menggunakan { echo: "" } agar input terlihat

  if (choice === "3") {
    console.log("Exiting...");
    process.exit(0);
  }

  if (choice === "1") return "api";
  if (choice === "2") return "qr";

  console.log("Invalid choice. Exiting...");
  process.exit(1);
};
