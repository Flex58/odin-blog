exports.verifyRefreshToken = (token) => {
  const date = new Date();
  return token.expiryDate.getTime() < date.getTime();
};
