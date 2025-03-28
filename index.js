require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Conectado"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Definir modelo Produto
const ProdutoSchema = new mongoose.Schema({
  nome: String,
  preco: Number,
  descricao: String,
});

const Produto = mongoose.model("Produto", ProdutoSchema);

// Criar rota para buscar produtos
app.get("/api/produtos", async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// Definir modelo Usuário
const UsuarioSchema = new mongoose.Schema({
  full_name: String,
  gender: String,
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

// Criar rota para cadastrar usuário
app.post("/register", async (req, res) => {
  try {
    const { full_name, gender } = req.body;
    const novoUsuario = new Usuario({ full_name, gender });
    await novoUsuario.save();
    res.status(201).json({ message: "Usuário cadastrado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
