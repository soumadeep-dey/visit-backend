import { Router } from "express";
import { AppDataSource } from "../../data-source";
import { Lead } from "./lead.entity";

export const leadsRouter = Router();

/** Create lead */
leadsRouter.post("/leads", async (req, res) => {
  const repo = AppDataSource.getRepository(Lead);
  const lead = repo.create(req.body);
  const saved = await repo.save(lead);
  res.status(201).json(saved);
});

/** Get all leads */
leadsRouter.get("/leads", async (req, res) => {
  const repo = AppDataSource.getRepository(Lead);
  const leads = await repo.find();
  res.json(leads);
});

/** Get lead by ID */
leadsRouter.get("/leads/:id", async (req, res) => {
  const repo = AppDataSource.getRepository(Lead);
  const lead = await repo.findOneBy({ id: Number(req.params.id) });
  if (!lead) return res.status(404).json({ error: "Lead not found" });
  res.json(lead);
});

/** Update lead */
leadsRouter.patch("/leads/:id", async (req, res) => {
  const repo = AppDataSource.getRepository(Lead);
  const lead = await repo.findOneBy({ id: Number(req.params.id) });
  if (!lead) return res.status(404).json({ error: "Lead not found" });

  repo.merge(lead, req.body);
  const saved = await repo.save(lead);
  res.json(saved);
});

/** Delete lead */
leadsRouter.delete("/leads/:id", async (req, res) => {
  const repo = AppDataSource.getRepository(Lead);
  const lead = await repo.findOneBy({ id: Number(req.params.id) });
  if (!lead) return res.status(404).json({ error: "Lead not found" });

  await repo.remove(lead);
  res.json({ success: true });
});
