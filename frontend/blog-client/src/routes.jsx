import { redirect } from "react-router";
import App from "./App";
import LoginForm from "./components/LoginForm";
import { authMiddlware, setUser } from "./middleware/auth";
import { authLoader } from "./utils/authLoader";
import { submitLogin } from "./utils/submitLogin";

const routes = [
  {
    middleware: [authMiddlware],
    children: [
      {
        path: "/",
        element: <App />,
        loader: authLoader,
      },
      {
        path: "/login",
        element: <LoginForm />,
        action: async ({ request }) => {
          const formData = await request.formData();
          const user = await submitLogin(
            formData.get("email"),
            formData.get("password"),
          );
          setUser(user);
          return redirect("/");
        },
      },
    ],
  },
];

export default routes;
