const db = require("../lib/queries");

exports.createRefreshToken = async (userId) => {
  const maxAge = 60 * 60 * 24 * 14;
  const expiryDate = new Date().setSeconds(maxAge); //14days
  const refreshToken = await db.createRefreshToken(userId, expiryDate);
  return { refreshToken: refreshToken.token, maxAge };
};
