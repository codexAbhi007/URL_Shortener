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
  console.log(generatedHash);
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

  const compare = await AuthService.comparePass(password, user.password);

  if (!compare) {
    return res.status(401).json({ message: "Invalid password." });
  }

  // res.cookie("isLoggedIn", "true");

  const token = AuthService.generateToken({
    id: user.id,
    username: user.username,
    email: user.email,
  });

  return res
    .status(200)
    .cookie("access_token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      message: "Login successful",
      token,
      user,
    });
  // res.cookie("access_token",token,{
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "strict",
  //   maxAge: 3600000
  // })
};

export const logout =async(req, res)=>{
    res
    .status(200)
    .cookie("access_token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
}



// controllers/auth.controller.js
export const getProfile = (req, res) => {
  const { id, username, email } = req.user;
  return res.status(200).json({
    message: "User profile fetched successfully",
    user: { id, username, email },
  });
};
