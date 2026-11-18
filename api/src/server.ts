import express from "express";
import helmet from "helmet";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(helmet());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.get("/api/health", (_req: any, res: any) => res.json({ ok: true }));

app.listen(4000, () => console.log("API: http://localhost:4000"));