import { Router } from "express";
import HealthRouter from "../routes/health";

const router = Router();

router.use("/health", HealthRouter);

export default router;