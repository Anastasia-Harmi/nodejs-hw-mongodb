import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody';
import { registerUserSchema } from '../validation/auth';
const authRouter = Router();
authRouter.post('/register', validateBody(registerUserSchema));
export default authRouter;
