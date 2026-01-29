import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();

/**
 * JojoSpeed API (Render-friendly)
 * - GET  /ping
 * - GET  /download?size=15000000
 * - POST /upload
 *
 * Notes for "free tier":
 * - Keep payload sizes capped to avoid burning monthly bandwidth.
 * - Render free services can spin down after inactivity; frontend "wake" handles cold start.
 */

// CORS permissive for quick start (restrict later if you want)
app.use(cors({ origin: true }));

// Ping: tiny and fast
app.get("/ping", (req, res) => {
  res.set({
    "Cache-Control": "no-store",
    "Content-Type": "text/plain; charset=utf-8"
  });
  res.status(200).send("pong");
});

// Download: stream pseudo-random bytes, no compression, no cache
// size capped to 50MB per request to protect your free bandwidth
app.get("/download", (req, res) => {
  const requested = parseInt(req.query.size || "15000000", 10);
  const size = Number.isFinite(requested)
    ? Math.max(1, Math.min(requested, 50_000_000))
    : 15_000_000;

  res.set({
    "Content-Type": "application/octet-stream",
    "Content-Length": String(size),
    "Cache-Control": "no-store",
    "Pragma": "no-cache",
    "Expires": "0",
    "Content-Encoding": "identity"
  });

  const chunkSize = 64 * 1024; // 64KB
  let remaining = size;

  const sendChunk = () => {
    if (remaining <= 0) return res.end();
    const n = Math.min(chunkSize, remaining);
    remaining -= n;

    const buf = crypto.randomBytes(n);
    const ok = res.write(buf);
    if (ok) setImmediate(sendChunk);
    else res.once("drain", sendChunk);
  };

  sendChunk();
});

// Upload: consume stream and respond OK (no storage)
app.post("/upload", (req, res) => {
  res.set({ "Cache-Control": "no-store" });

  req.on("data", () => {});
  req.on("end", () => res.status(200).json({ ok: true }));
  req.on("error", () => res.status(500).json({ ok: false }));
});

// Basic health endpoint
app.get("/", (req, res) => res.status(200).json({ name: "JojoSpeed API", ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`JojoSpeed API listening on :${PORT}`));
