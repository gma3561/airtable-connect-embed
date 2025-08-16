import { Request, Response } from "express";
import { z } from "zod";
import { PropertyService } from "../service/PropertyService.js";

const QuerySchema = z.object({
  q: z.string().trim().optional(),
  propertyType: z.string().trim().optional(),
  transactionType: z.string().trim().optional(),
  propertyStatus: z.string().trim().optional(),
  agent: z.string().trim().optional(),
  sharedOnly: z
    .union([z.literal("true"), z.literal("false")])
    .transform((v) => v === "true")
    .optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional()
});

export class PropertyController {
  constructor(private readonly service = new PropertyService()) {}

  search = async (req: Request, res: Response) => {
    const parsed = QuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid query", details: parsed.error.flatten() });
    }

    const { q, propertyType, transactionType, propertyStatus, agent, sharedOnly, limit, offset } = parsed.data;

    const items = await this.service.search({
      text: q,
      propertyType,
      transactionType,
      propertyStatus,
      agent,
      sharedOnly,
      limit: limit ?? 50,
      offset: offset ?? 0
    });

    res.json({ items });
  };
}
