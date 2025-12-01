import express from "express";
import bodyParser from "body-parser";
import { json } from "body-parser";
import { visitsRouter } from "./modules/visits/visit.controller";
import { leadsRouter } from "./modules/leads/lead.controller";

export const createApp = () => {
  const app = express();
  app.use(json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/", (req, res) => res.json({ ok: true, service: "visit-backend" }));

  app.use("/api", visitsRouter);
  app.use("/api", leadsRouter);

  // simple error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    res.status(500).json({ error: err?.message ?? "Server error" });
  });

  return app;
};
