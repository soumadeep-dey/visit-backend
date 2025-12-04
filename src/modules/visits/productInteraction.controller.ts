// src/modules/visits/principalInteraction.controller.ts
import { Router } from "express";
import { AppDataSource } from "../../data-source";
import { PrincipalInteraction } from "./principalInteraction.entity";
import { Interaction } from "./interaction.entity";
import { generateCode } from "../../utils/codeGenerator";
import { Visit } from "./visit.entity";

export const principalInteractionsRouter = Router();

/** Create principal Interaction
 * Body should include at least: { principalName?: string, product?: string }
 * The endpoint will attach to the given interactionId (must exist).
 */
principalInteractionsRouter.post(
  "/interactions/:interactionId/principal-interactions",
  async (req, res) => {
    try {
      const interactionId = Number(req.params.interactionId);
      if (isNaN(interactionId)) {
        return res.status(400).json({ error: "Invalid interactionId" });
      }

      const interactionRepo = AppDataSource.getRepository(Interaction);
      const interaction = await interactionRepo.findOneBy({
        id: interactionId,
      });
      if (!interaction)
        return res.status(404).json({ error: "Interaction not found" });

      const repo = AppDataSource.getRepository(PrincipalInteraction);
      const count = await repo.count();
      const piCode = generateCode("PI", count);

      // Accept principalName and optional fields from UI
      const {
        principalName,
        product,
        objective,
        discussion,
        nextStep,
        followUpDate,
      } = req.body || {};

      const pi = repo.create({
        interactionId,
        piCode,
        principalName,
        product,
        objective,
        discussion,
        nextStep,
        followUpDate,
        linkedInteractions: [], // initialize to empty array
      });

      const saved = await repo.save(pi);
      return res.status(201).json(saved);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

/** Update Principal Interaction (including linkedInteractions) */
principalInteractionsRouter.patch(
  "/principal-interactions/:id",
  async (req, res) => {
    try {
      const repo = AppDataSource.getRepository(PrincipalInteraction);

      const pi = await repo.findOneBy({ id: Number(req.params.id) });
      if (!pi)
        return res
          .status(404)
          .json({ error: "Principal Interaction not found" });

      // Allow updating any fields (principalName, objective, discussion, product, linkedInteractions, leadId, etc.)
      // Validate linkedInteractions shape optionally on server side
      const updated = { ...req.body };

      // If client sent linkedInteractions as array of objects, accept it; else ignore invalid
      if (
        updated.linkedInteractions &&
        !Array.isArray(updated.linkedInteractions)
      ) {
        return res
          .status(400)
          .json({ error: "linkedInteractions must be an array" });
      }

      repo.merge(pi, updated);
      const saved = await repo.save(pi);

      // return with relations
      const full = await repo.findOne({
        where: { id: saved.id },
        relations: ["interaction", "interaction.visit", "lead"],
      });

      return res.json(full);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

/** Get all principal interactions with relation data */
principalInteractionsRouter.get("/principal-interactions", async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(PrincipalInteraction);

    const all = await repo.find({
      relations: ["interaction", "interaction.visit", "lead"],
      order: { createdAt: "DESC" },
    });

    return res.json(all);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

/** Get principal interactions filtered by principal name */
principalInteractionsRouter.get(
  "/principal-interactions/principal/:name",
  async (req, res) => {
    try {
      const name = req.params.name;
      if (!name)
        return res.status(400).json({ error: "principal name required" });

      const repo = AppDataSource.getRepository(PrincipalInteraction);

      const list = await repo.find({
        where: { principalName: name },
        relations: ["interaction", "interaction.visit", "lead"],
        order: { createdAt: "DESC" },
      });

      return res.json(list);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * Optional useful: get principal interactions for a specific customer + principal
 * GET /principal-interactions/customer/:customer/principal/:name
 */
principalInteractionsRouter.get(
  "/principal-interactions/customer/:customer/principal/:name",
  async (req, res) => {
    try {
      const { customer, name } = req.params;
      if (!customer || !name)
        return res
          .status(400)
          .json({ error: "customer and principal required" });

      const repo = AppDataSource.getRepository(PrincipalInteraction);

      // fetch candidates with relations then filter by visit.customerName
      const list = await repo.find({
        where: { principalName: name },
        relations: ["interaction", "interaction.visit", "lead"],
        order: { createdAt: "DESC" },
      });

      const filtered = list.filter((p) => {
        const visitCustomer = p.interaction?.visit?.customerName;
        // compare case-insensitively
        return (
          typeof visitCustomer === "string" &&
          visitCustomer.toLowerCase() === customer.toLowerCase()
        );
      });

      return res.json(filtered);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);
