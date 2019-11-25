import { Router } from "express";
import {
  getUserFromDbHandler,
  getUsersFromDbHandler,
  setUserToDbHandler,
  changeUserInDbHandler
} from "./requestHandlers/mongoDbHandlers";

const router = Router();

router.get("/users", getUsersFromDbHandler);

router.get("/users/:id", getUserFromDbHandler);

router.post("/users", setUserToDbHandler);

router.put("/users", changeUserInDbHandler);

export default router;
