export const validateResetPassword = (req, res, next) => {
    let { currentPassword, newPassword } = req.body;
  
    const errors = {};
  
    if (!currentPassword) {
      errors.currentPassword = "Current password is required";
    }
  
    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
  
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        errors,
      });
    }
  
    next();
  };