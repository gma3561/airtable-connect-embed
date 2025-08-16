import express, { Request, Response } from "express";
import cors from "cors";
import { PropertyController } from "./PropertyController.js";
import { requestLogger } from "./logging.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger());

const propertyController = new PropertyController();

app.get("/api/health", (_req: Request, res: Response) => res.json({ ok: true }));
app.get("/api/properties/search", propertyController.search);
app.post("/api/properties", propertyController.create);
app.put("/api/properties/:id", propertyController.update);

const port = Number(process.env.PORT || 8787);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
