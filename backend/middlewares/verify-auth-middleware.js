import { refreshTokens, verifyJWTtoken } from "../services/auth.services.js";

//1) extract accessToken and refreshToken from cookies
//2) if neither token exists move to the next middleware
//3) if an access token is present
//      Try to decode and verify
//      If valid attach the decoded user data (req.user = decodedToken) and move forward
//4) if access token is missing
//      call refreshTokens(resfreshToken) to generate a new access token and refresh token
//      Attach user data to req.user
//      store to the new tokens in user's cookies
//      Proceed to next

//refreshTokens func
// When an access token expires it creates new tokens
//Decode the refresh token
// fetch the session from database
//if session if invalid or expired, throw an error
//fetch user details
//if the user exists
//      Create a new access token
//      Create a new refresh token
//      Return both tokesn and user data
//If successful the new tokens will be stored in the user's cookies for future authentication

// export const verifyAuthentication = (req, res, next) => {
//   // console.log(`hello`)
//   const { access_token } = req.cookies;
//   // console.log(token)
//   if (!access_token) {
//     return res.status(401).json({ message: "Unauthorized: No token" });
//   }

//   try {
//     const decodedToken = verifyJWTtoken(access_token);
//     console.log(decodedToken);
//     req.user = decodedToken;
//     console.log(`req.user:`, req.user);
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

export const verifyAuthentication = async (req, res, next) => {
  // console.log(`hello`)
  const { accessToken, refreshToken } = req.cookies;
  // console.log(token)

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: "Unauthorized: Please Login" });
  }

  try {
    if (accessToken) {
      const decodedToken = verifyJWTtoken(accessToken);
      req.user = decodedToken;
      return next();
    }

    if (refreshToken) {
      
      const { new_accessToken, new_refreshToken, user } = await refreshTokens(
        refreshToken
      );
      req.user = user;
      res
        .cookie("accessToken", new_accessToken, {
          expires: new Date(
            Date.now() + process.env.ACCESS_TOKEN_COOKIE_EXPIRE * 60 * 100
          ),
          httpOnly: true,
          secure: true,
        })
        .cookie("refreshToken", new_refreshToken, {
          expires: new Date(
            Date.now() +
              process.env.REFRESH_TOKEN_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
          ),
          httpOnly: true,
          secure: true,
        });

      return next();
    }

 
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: "Invalid token" });
  }
};
