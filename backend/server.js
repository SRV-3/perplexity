import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/databse.js";
import { testAi } from "./src/services/ai.service.js";

const PORT = process.env.PORT || 8000;

connectDB();
testAi();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
