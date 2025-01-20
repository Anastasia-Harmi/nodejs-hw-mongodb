import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import * as authController from '../controllers/auth.js';
import { authenticate } from '../middlewares/autheticate.js';

const authRouter = Router();

authRouter.use(authenticate); //спершу запит пройде через перевірку authenticate,а вже потім в маршрути

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
  '/refresh',
  ctrlWrapper(authController.refreshUsersSessionController),
);
