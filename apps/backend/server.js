const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB, disconnectDB } = require("./db");
const User = require("/Model/user");

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conectar a la base de datos al iniciar la app
connectDB();

app.post("/user", async (request, response) => {
  try {
    const { email, phone, fullName, skills } = request.body;
    let user = await User.findOne({ email });
    if (user) {
      return response.redirect("http://localhost:5500/auth?id=${user._id}");
    }
    user = new User({ email, phone, fullName, skills });
    await user.save();
    response.redirect("http://localhost:5500/auth?id=${user._id}");
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.post("/skill", async (request, response) => {
  try {
    const { email, skills } = request.body;
    let user = await User.findOne({ email });
    if (!user) {
      return response.status(404).json({ message: "Usuario no encontrado" });
    }
    user.skills.push(skills);
    await user.save();
    response.json({ message: "Hábilidad guardada", user });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
  response.json({ message: "Nuevo skill agregado." });
});

app.get("/user", async (request, response) => {
  // TODO: Obtener tu información de usuario (incluyendo skills) de la DB (Mongo)
  try {
    const { email } = request.query;
    let user = await User.findOne({ email });
    if (!user) {
      return response.status(404).json({ message: "Usuario no encontrado" });
    }
    response.json({ user });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.get("/users", async (request, response) => {
  try {
    const users = await User.find();
    response.json({ data: [], message: "Usuarios y skills." });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log("Listening on PORT", PORT));

// Desconectar cuando la app se cierre (por ejemplo, en casos de interrupción)
process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});
