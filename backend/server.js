import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Health check and metadata routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/info", (req, res) => {
  res.json({ name: "ee-2048-backend", version: "1.0.0" });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on ${port}`);
});

