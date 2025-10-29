import dotenv from "dotenv";
import express from "express";
import { sequelize } from "./models/sequelize.js";
import useRoute from "./routes/route.js";
import "./models/country.js";

const app = express();
const PORT =  3000;

dotenv.config();

app.use(express.json());


// Define routes
app.use("/", useRoute)



app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});



(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected successfully");
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("Startup failure:", err);
    process.exit(1);
  }
})();
