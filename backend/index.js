import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ path: ".env.local" });

let port=8000;


import mongoose from "mongoose"

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/VideoTube');
};

// app.get("/",(req,res)=>{
//   res.send("Server is running");
// });


app.listen(port,()=>{
  console.log(`Server is running at PORT ${port}`);
});
