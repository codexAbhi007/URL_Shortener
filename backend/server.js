import app from "./app.js";
import { connectDB } from "./config/urlDB.js";

const PORT = process.env.PORT || 3000

connectDB().then(()=>{
    app.listen(PORT,()=>console.log(`Server running on http://localhost:${PORT}`))
})