import { authContext } from "./authContext";

export const authLoader = async ({ context }) => {
  const user = context.get(authContext);
  return user;
};
