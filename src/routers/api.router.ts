import { Router } from "express";

import { authRouter } from "./auth.router.js";
import { brandRouter } from "./brand.router.js";
import { carRouter } from "./car.router.js";
import { userRouter } from "./user.router.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/cars", carRouter);
router.use("/brands", brandRouter);

export const apiRouter = router;
