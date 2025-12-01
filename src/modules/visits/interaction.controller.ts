import { Router } from "express";
import { AppDataSource } from "../../data-source";
import { Interaction } from "./interaction.entity";
import { Visit } from "./visit.entity";
import { generateCode } from "../../utils/codeGenerator";

export const interactionsRouter = Router();

/** Create Interaction */
interactionsRouter.post("/visits/:visitId/interactions", async (req, res) => {
  const visitId = Number(req.params.visitId);

  const visitRepo = AppDataSource.getRepository(Visit);
  const visit = await visitRepo.findOneBy({ id: visitId });

  if (!visit) return res.status(404).json({ error: "Visit not found" });

  const repo = AppDataSource.getRepository(Interaction);
  const count = await repo.count();
  const interactionCode = generateCode("I", count);

  const interaction = repo.create({
    visitId,
    interactionCode,
    departments: [],
    personsMet: [],
    products: [],
  });

  const saved = await repo.save(interaction);
  res.status(201).json(saved);
});

/** Update Interaction */
interactionsRouter.patch("/interactions/:id", async (req, res) => {
  const repo = AppDataSource.getRepository(Interaction);

  const interaction = await repo.findOneBy({ id: Number(req.params.id) });
  if (!interaction)
    return res.status(404).json({ error: "Interaction not found" });

  repo.merge(interaction, req.body);
  const saved = await repo.save(interaction);

  return res.json(saved);
});
