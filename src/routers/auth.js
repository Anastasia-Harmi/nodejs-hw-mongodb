import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
} from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import * as authController from '../controllers/auth.js';
import { logoutUserController } from '../services/auth.js';
import { resetPasswordSchema } from '../validation/auth.js';

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

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(authController.requestResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(authController.resetPasswordController),
);

authRouter.post(
  '/refresh',
  ctrlWrapper(authController.refreshUsersSessionController),
);

authRouter.post('/logout', ctrlWrapper(logoutUserController));
