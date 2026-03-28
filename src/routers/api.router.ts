import { Router } from "express";

import { authRouter } from "./auth.router.js";
import { carRouter } from "./car.router.js";
import { userRouter } from "./user.router.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/cars", carRouter);

export const apiRouter = router;
