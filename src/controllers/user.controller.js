import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { unlinkTempFiles } from "../utils/unlinkTempFiles.js";

const userController = asyncHandler(async function (req, res) {
  const { fullName, userName, email, password } = req.body;
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    unlinkTempFiles([coverImageLocalPath]);
    throw new ApiError(400, "Avatar image is requiered");
  }

  if (
    [fullName, userName, email, password].some((item) => item?.trim() === "")
  ) {
    unlinkTempFiles([avatarLocalPath, coverImageLocalPath]);
    throw new ApiError(400, "All fileds are requiered");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existedUser) {
    unlinkTempFiles([avatarLocalPath, coverImageLocalPath]);
    throw new ApiError(409, "User with email or username already exist");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar image is requiered");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url ?? "",
    userName: userName.toLowerCase(),
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the User");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

export { userController };
