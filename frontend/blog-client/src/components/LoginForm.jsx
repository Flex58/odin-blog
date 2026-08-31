import { Form } from "react-router";
import NavBar from "./NavBar";

function LoginForm() {
  return (
    <>
      <NavBar />
      <Form action="/login" method="POST">
        <label htmlFor="email">Email: </label>
        <input type="email" name="email" required />
        <label htmlFor="password">Password: </label>
        <input type="password" name="password" required />
        <button type="submit">Log In</button>
      </Form>
    </>
  );
}
export default LoginForm;
