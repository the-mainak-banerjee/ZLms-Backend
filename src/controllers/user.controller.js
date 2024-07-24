import { asyncHandler } from "../utils/asyncHandler.js";

const userController = asyncHandler(function (req, res) {
  res.status(200).json({
    message: "User controller",
  });
});

export { userController };
