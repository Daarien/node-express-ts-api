import { Router } from "express";
import {
  getUsersFromJsonHandler,
  getUserFromJsonHandler,
  setUserToJsonHandler,
  changeUserInJsonHandler
} from "./requestHandlers/jsonDataHandlers";

const router = Router();

router.get("/users", getUsersFromJsonHandler);

router.get("/users/:id", getUserFromJsonHandler);

router.post("/users", setUserToJsonHandler);

router.put("/users", changeUserInJsonHandler);

export default router;
