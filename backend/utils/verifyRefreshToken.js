exports.verifyRefreshToken = (token) => {
  return token.expiryDate.getTime() < new Date.getTime();
};
