import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
import { notfound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
const port = process.env.PORT || 5288;
import userRoutes from "./routes/userRoutes.js";

connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/users", userRoutes);

if (process.env.NODE_ENV === "production") {
  const _dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("Server is ready"));
}

app.use(notfound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
