import { Router } from "express";
import { AppDataSource } from "../../data-source";
import { Visit } from "./visit.entity";
import { Interaction } from "./interaction.entity";
import { PrincipalInteraction } from "./principalInteraction.entity";
import { Lead } from "../leads/lead.entity";
import { generateCode } from "../../utils/codeGenerator";

export const visitsRouter = Router();

/** Create Visit with auto Vxxxx code */
visitsRouter.post("/visits", async (req, res) => {
  const repo = AppDataSource.getRepository(Visit);

  const count = await repo.count();
  const visitCode = generateCode("V", count);

  const visit = repo.create({
    visitCode,
    status: "draft",
  });

  const saved = await repo.save(visit);
  return res.status(201).json(saved);
});

/** Get all visits with aggregated stats */
visitsRouter.get("/visits", async (req, res) => {
  const visitRepo = AppDataSource.getRepository(Visit);
  const interactionRepo = AppDataSource.getRepository(Interaction);
  const principalRepo = AppDataSource.getRepository(PrincipalInteraction);

  // 1. Fetch all visits (basic information)
  const visits = await visitRepo.find({
    order: { createdAt: "DESC" }
  });

  // 2. Attach aggregated stats
  const enriched = await Promise.all(
    visits.map(async (visit) => {
      // All interactions for this visit
      const interactions = await interactionRepo.find({
        where: { visitId: visit.id },
      });

      const totalInteractions = interactions.length;

      // Total persons met (sum of all personsMet arrays)
      let totalPersonsMet = 0;
      interactions.forEach((i) => {
        if (i.personsMet?.length) {
          totalPersonsMet += i.personsMet.length;
        }
      });

      // Leads generated through principal interactions
      const principalInteractions = await principalRepo.find({
        where: { interaction: { visitId: visit.id } },
        relations: ["lead"],
      });

      const totalLeadsGenerated = principalInteractions.filter(
        (pi) => pi.leadId != null
      ).length;

      return {
        ...visit,
        dateFrom: visit.dateFrom ?? null,
        dateTo: visit.dateTo ?? null,
        totalInteractions,
        totalPersonsMet,
        totalLeadsGenerated,
      };
    })
  );

  return res.json(enriched);
});


/** Update Visit */
visitsRouter.patch("/visits/:id", async (req, res) => {
  const repo = AppDataSource.getRepository(Visit);

  const visit = await repo.findOneBy({ id: Number(req.params.id) });
  if (!visit) return res.status(404).json({ error: "Visit not found" });

  repo.merge(visit, req.body);
  const saved = await repo.save(visit);

  return res.json(saved);
});

/** Submit Visit */
visitsRouter.patch("/visits/:id/submit", async (req, res) => {
  const repo = AppDataSource.getRepository(Visit);

  const visit = await repo.findOneBy({ id: Number(req.params.id) });
  if (!visit) return res.status(404).json({ error: "Visit not found" });

  visit.status = "submitted";
  const saved = await repo.save(visit);

  return res.json(saved);
});

/** Get visit with full relations */
visitsRouter.get("/visits/:id", async (req, res) => {
  const repo = AppDataSource.getRepository(Visit);

  const visit = await repo.findOne({
    where: { id: Number(req.params.id) },
    relations: [
      "interactions",
      "interactions.principalInteractions",
      "interactions.principalInteractions.lead",
    ],
  });

  if (!visit) return res.status(404).json({ error: "Visit not found" });
  return res.json(visit);
});

/** Get all visits */
visitsRouter.get("/visits", async (req, res) => {
  const repo = AppDataSource.getRepository(Visit);

  const visits = await repo.find({
    order: { createdAt: "DESC" },
  });

  return res.json(visits);
});
