import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

router.post("/report", async (req, res) => {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      res.status(500).json({ error: "Webhook URL tidak dikonfigurasi" });
      return;
    }

    const { nama, pesan, fileNames } = req.body;

    const embed = {
      title: "🚨 Laporan Emergency Baru!",
      color: 0xff0000,
      fields: [
        { name: "Nama Pelapor", value: nama || "Anonim", inline: true },
        { name: "Pesan Laporan", value: pesan || "-", inline: false },
        {
          name: "File / Foto",
          value:
            fileNames && fileNames.length > 0
              ? fileNames.join(", ")
              : "Tidak ada file",
          inline: false,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: { text: "Emergency Call - Apip" },
    };

    const discordPayload = {
      username: "Emergency Call Bot",
      embeds: [embed],
    };

    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordPayload),
    });

    if (!discordRes.ok) {
      const text = await discordRes.text();
      logger.error({ status: discordRes.status, text }, "Discord webhook error");
      res.status(500).json({ error: "Gagal mengirim ke Discord" });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Error sending report");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
