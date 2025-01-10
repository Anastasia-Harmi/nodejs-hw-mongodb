import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });

    next(); //якщо тіло запиту відповідатиме вимогам схеми, то next,  передасть далі роботу контроллеру
  } catch (err) {
    const error = createHttpError(400, 'Bad Request', {
      errors: err.details,
    });

    next(error); //помилку пересилаємо в мідлвару errorHandler,де її обробляємо
  }
};
