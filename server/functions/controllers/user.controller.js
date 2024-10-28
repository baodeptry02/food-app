const catchAsync = require('../utils/catchAsync');
const { OK, CREATED, BAD_REQUEST } = require('../config/response.config');
const APIError = require('../utils/APIError');
const userService = require('../services/user.service');

class UserController {
  createUser = catchAsync(async (req, res) => {
    const user = req.body;
    try {
      await saveUserToFirestore(user);
      return CREATED(res, 'User created successfully', user);
    } catch (error) {
      throw new APIError(500, 'Error creating user', error.stack);
    }
  });

  updateUser = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;

    if (!userId) {
      return BAD_REQUEST(res, 'User ID is required');
    }

    try {
      await updateUserInFirestore(userId, updatedData);
      return OK(res, 'User updated successfully', updatedData);
    } catch (error) {
      throw new APIError(500, 'Error updating user', error.stack);
    }
  });

  sendForgetPassword = catchAsync(async (req, res) => {
    const { email } = req.body;
    try {
      await userService.sendForgetPassword(email);
      return OK(res, 'Password reset email sent');
    } catch (error) {
      throw new APIError(
        500,
        'Error sending password reset email',
        error.stack
      );
    }
  });
}

module.exports = new UserController();
