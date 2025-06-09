import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const shortenUrl = (data) => API.post("/shorten", data);
export const getAllShortLinks = () => API.get("/shorten/view"); //
export const getOriginalUrl = (code) => API.get(`/shorten/${code}`);
export const postRegister = (data) => API.post(`/app/register`, data);
export const getProfile = () => API.get("/app/profile");
export const postLogin = (data) => API.post("/app/login", data);
export const logoutUser = () => API.get("/app/logout");
export const deleteShortLink = (code) => {
  return API.delete(`/shorten/${code}`);
};
export const updateShortCode = (code, { originalUrl, newCode }) => {
  return API.patch(`/shorten/${code}`, { originalUrl, newCode });
};

export const generateEmail = (data)=> API.post(`/app/email/generate`,data);
export const verifyEmail = ({id,userCode})=>{
  return API.post(`/app/email/verify`,{id,userCode})
}

export const generateEmailAfterLogin = ({id,email})=>{
  return API.post(`/app/profile/email/generate`,{id,email})
}