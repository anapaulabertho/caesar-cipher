import { Router } from "express";
import HealthRouter from "../routes/health";
import DecipherRouter from "../routes/decipher";

const router = Router();

router.use("/health", HealthRouter);
router.use("/decipher", DecipherRouter);

export default router;