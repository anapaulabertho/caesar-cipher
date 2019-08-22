import { Router } from "express";
import DecipherService from "../../services/decipher-service";

const router = Router();

router.get("/", async (req, res, next) => {
  console.info("Received a request to decipher");
  try {
    const decipherService = new DecipherService();
    let response = await decipherService.execute();
    return res.status(200).send({
      response
    });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
});

export default router;