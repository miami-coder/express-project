import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/sc.enum.js";
import { User } from "../models/user.model.js";

class AuthController {
    public async register(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { name, email, password } = req.body;

            const isUserExist = await User.findOne({ email });
            if (isUserExist) {
                res.status(StatusCodesEnum.BAD_REQUEST).json({
                    message: "User with this email already exists",
                });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
            });

            res.status(StatusCodesEnum.CREATED).json({
                message: "User registered successfully.",
                data: user,
            });
        } catch (e) {
            next(e);
        }
    }
    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email }).select("+password");
            if (!user || !(await bcrypt.compare(password, user.password))) {
                res.status(StatusCodesEnum.UNAUTHORIZED).json({
                    message: "Invalid email or password",
                });
                return;
            }

            res.status(StatusCodesEnum.OK).json({
                message: "User logged in successfully.",
                data: user,
            });
        } catch (e) {
            next(e);
        }
    }
}

export const authController = new AuthController();
