import { Router } from "express";

const router = Router();

router.get("/", (req, res, next) => {
  console.info("Received a request to health");
  return res.sendStatus(200);
});

export default router;