export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";

  // Convert COOKIE_EXPIRE from days to milliseconds
  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE, 10);
   if (isNaN(cookieExpireDays)) {
     throw new Error("Invalid COOKIE_EXPIRE environment variable");
   }
  const cookieExpireMs = cookieExpireDays * 24 * 60 * 60 * 1000;

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(Date.now() + cookieExpireMs),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only set secure flag in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
