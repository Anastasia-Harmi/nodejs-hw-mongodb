import * as authServices from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const user = await authServices.registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};
