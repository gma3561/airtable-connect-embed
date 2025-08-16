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

const CreateSchema = z.object({
  propertyName: z.string().trim().min(1, 'propertyName is required'),
  address: z.string().trim().optional(),
  buildingDong: z.string().trim().optional(),
  buildingHo: z.string().trim().optional(),
  propertyType: z.string().trim().optional(),
  transactionType: z.string().trim().optional(),
  propertyStatus: z.string().trim().optional(),
  price: z.string().trim().optional(),
  contractPeriod: z.string().trim().optional(),
  rentalAmount: z.string().trim().optional(),
  rentalType: z.string().trim().optional(),
  resident: z.string().trim().optional(),
  completionDate: z.string().trim().optional(),
  reregistrationReason: z.string().trim().optional(),
  agentMemo: z.string().trim().optional(),
  specialNotes: z.string().trim().optional(),
  registrationDate: z.string().trim().optional(),
  sharedStatus: z.boolean().optional(),
  agent: z.string().trim().optional()
});

const UpdateSchema = CreateSchema.partial();

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

  create = async (req: Request, res: Response) => {
    const parsed = CreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid body", details: parsed.error.flatten() });
    }
    const id = await this.service.create(parsed.data);
    return res.status(201).json({ id });
  };

  update = async (req: Request, res: Response) => {
    const id = String(req.params.id || '');
    if (!id) return res.status(400).json({ error: 'Missing id' });
    const parsed = UpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid body", details: parsed.error.flatten() });
    }
    await this.service.update(id, parsed.data);
    return res.json({ ok: true });
  };

  findById = async (req: Request, res: Response) => {
    const id = String(req.params.id || '');
    if (!id) return res.status(400).json({ error: 'Missing id' });
    
    const property = await this.service.findById(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    return res.json(property);
  };

  delete = async (req: Request, res: Response) => {
    const id = String(req.params.id || '');
    if (!id) return res.status(400).json({ error: 'Missing id' });
    
    await this.service.delete(id);
    return res.json({ ok: true });
  };
}
