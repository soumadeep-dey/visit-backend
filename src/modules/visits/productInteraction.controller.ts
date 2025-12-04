import { Router } from "express";
import { AppDataSource } from "../../data-source";
import { PrincipalInteraction } from "./principalInteraction.entity";
import { Interaction } from "./interaction.entity";
import { generateCode } from "../../utils/codeGenerator";

export const principalInteractionsRouter = Router();

/** Create principal Interaction */
principalInteractionsRouter.post(
  "/interactions/:interactionId/principal-interactions",
  async (req, res) => {
    const interactionId = Number(req.params.interactionId);

    const interactionRepo = AppDataSource.getRepository(Interaction);
    const interaction = await interactionRepo.findOneBy({ id: interactionId });
    if (!interaction)
      return res.status(404).json({ error: "Interaction not found" });

    const repo = AppDataSource.getRepository(PrincipalInteraction);
    const count = await repo.count();
    const piCode = generateCode("PI", count);

    const pi = repo.create({
      interactionId,
      piCode,
      principalName: req.body.principalName,
    });

    const saved = await repo.save(pi);
    return res.status(201).json(saved);
  }
);

/** Update Principal Interaction */
principalInteractionsRouter.patch(
  "/principal-interactions/:id",
  async (req, res) => {
    const repo = AppDataSource.getRepository(PrincipalInteraction);

    const pi = await repo.findOneBy({ id: Number(req.params.id) });
    if (!pi)
      return res.status(404).json({ error: "Principal Interaction not found" });

    repo.merge(pi, req.body);
    const saved = await repo.save(pi);

    return res.json(saved);
  }
);
