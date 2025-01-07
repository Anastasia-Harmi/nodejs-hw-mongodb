export const ctrlWrapper = (ctrl) => {
  return async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error); //express шукає першу мідлвару з 4 параметрами(err, req, res, next) і там будемо обробляти помилку
      //   const { status = 500 } = error;
      //   res.status(status).json({
      //     status,
      //     message: error.message,
      //   });
      // }
    }
  };
};
