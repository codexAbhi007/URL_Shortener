import * as AuthService from "../services/auth.services.js";

export const getRegisterPage = (req, res) => {
  console.log("Register");
};

export const getLoginPage = (req, res) => {
  console.log("Login");
};

export const postRegister = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  const userExists = await AuthService.getUserByEmail(email);
  console.log(userExists);

  if (userExists) {
    return res
      .status(409)
      .json({ message: "User already exists! Sign In Instead" });
  }

  const generatedHash = await AuthService.generateHash(password);
  console.log(generatedHash)
  const [user] = await AuthService.createUser({
    username,
    email,
    password: generatedHash,
  });
  console.log(user);

  return res.status(201).json({ message: "Registration successful", user });
};

export const postLogin = async (req, res) => {
  // res.setHeader("Set-Cookie","")
  
  // console.log(req.body);
  const { email, password } = req.body;
  const user = await AuthService.getUserByEmail(email);
  // console.log(user);
  if (!user) {
    return res
    .status(409)
    .json({ message: "User does not Exists! Register First" });
  }
  
  const compare = await AuthService.comparePass(password, user.password)
  
  if (!compare) {
    return res.status(401).json({ message: "Invalid password." });
  }
  
  // res.cookie("isLoggedIn", "true");

  const token = AuthService.generateToken({
    id:user.id,
    username:user.username,
    email:user.email
  })
  res.cookie("access_token",token)
  return res.status(200).json({
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  });
};


// controllers/auth.controller.js
export const getProfile = (req, res) => {
  const { id, username, email } = req.user;
  return res.status(200).json({
    message: "User profile fetched successfully",
    user: { id, username, email },
  });
};

