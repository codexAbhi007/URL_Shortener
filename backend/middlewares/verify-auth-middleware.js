import { verifyJWTtoken } from "../services/auth.services.js";

export const verifyAuthentication = (req, res, next) => {
  // console.log(`hello`)
  const { access_token } = req.cookies;
  // console.log(token)
  if (!access_token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    const decodedToken = verifyJWTtoken(access_token);
    console.log(decodedToken);
    req.user = decodedToken;
    console.log(`req.user:`, req.user);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
