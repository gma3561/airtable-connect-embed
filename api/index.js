import express from "express";
import cors from "cors";
import { PropertyController } from "../server/src/http/PropertyController.js";
import { requestLogger } from "../server/src/http/logging.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger());

const propertyController = new PropertyController();

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/api/properties/search", propertyController.search);
app.get("/api/properties/:id", propertyController.findById);
app.post("/api/properties", propertyController.create);
app.put("/api/properties/:id", propertyController.update);
app.delete("/api/properties/:id", propertyController.delete);

export default app;