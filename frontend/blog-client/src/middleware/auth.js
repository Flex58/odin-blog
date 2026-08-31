import { verifyRefreshtoken } from "../utils/verifyRefreshToken";
import { authContext } from "../utils/authContext";

let verifiedUser = null;

const getUser = async () => {
  if (!verifiedUser) {
    verifiedUser = await verifyRefreshtoken();
  }
  return verifiedUser;
};

export const setUser = (value) => {
  verifiedUser = value;
  return;
};

export const authMiddlware = async ({ context }) => {
  const user = await getUser();
  context.set(authContext, user);
};
