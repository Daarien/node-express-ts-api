import { Router } from "express";
import { signUpHandler, loginHandler } from "./requestHandlers/authHandlers";

const router = Router();

router.post("/signup", signUpHandler);
router.post("/login", loginHandler);

export default router;
