import { Router } from "express";
import { AppDataSource } from "../../data-source";
import { generateCode } from "../../utils/codeGenerator";
import { Interaction } from "../visits/interaction.entity";
import { ProductInteraction } from "../visits/productInteraction.entity";

export const productInteractionsRouter = Router();

/** Create Product Interaction */
productInteractionsRouter.post(
  "/interactions/:interactionId/product-interactions",
  async (req, res) => {
    const interactionId = Number(req.params.interactionId);

    const interactionRepo = AppDataSource.getRepository(Interaction);
    const interaction = await interactionRepo.findOneBy({ id: interactionId });
    if (!interaction)
      return res.status(404).json({ error: "Interaction not found" });

    const repo = AppDataSource.getRepository(ProductInteraction);
    const count = await repo.count();
    const piCode = generateCode("PI", count);

    const pi = repo.create({
      interactionId,
      piCode,
      productName: req.body.productName,
    });

    const saved = await repo.save(pi);
    return res.status(201).json(saved);
  }
);

/** Update Product Interaction */
productInteractionsRouter.patch("/product-interactions/:id", async (req, res) => {
  const repo = AppDataSource.getRepository(ProductInteraction);

  const pi = await repo.findOneBy({ id: Number(req.params.id) });
  if (!pi)
    return res.status(404).json({ error: "Product Interaction not found" });

  repo.merge(pi, req.body);
  const saved = await repo.save(pi);

  return res.json(saved);
});
