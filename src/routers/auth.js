import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import * as authController from '../controllers/auth.js';

const authRouter = Router();
authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(authController.registerUserController),
);
export default authRouter;

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(authController.loginUserController),
);
