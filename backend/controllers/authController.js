import { createUser, getUserByEmail } from "../services/auth.services.js";

export const getRegisterPage = (req, res) => {
  console.log("Register");
};

export const getLoginPage = (req, res) => {
  console.log("Login");
};

export const postLogin = async (req, res) => {
  // res.setHeader("Set-Cookie","")
  res.cookie("isLoggedIn", "true");

  console.log(req.body);
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  console.log(user);
  if (!user) {
    return res
      .status(409)
      .json({ message: "User does not Exists! Register First" });
  }

 if (user.password !== password) {
    return res.status(401).json({ message: "Invalid password." });
  }

  return res.status(200).json({
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  });
};








export const postRegister = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  const userExists = await getUserByEmail(email);
  console.log(userExists);

  if (userExists) {
    return res
      .status(409)
      .json({ message: "User already exists! Sign In Instead" });
  }

  const [user] = await createUser({ username, email, password });
  console.log(user);

  return res.status(201).json({ message: "Registration successful", user });
};
