// index.js - Ponto de entrada alternativo para servidor com upload AJAX
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB conectado com sucesso');
}).catch((err) => {
  console.error('❌ Erro ao conectar no MongoDB:', err);
});

// Schema do pedido
const pedidoSchema = new mongoose.Schema({
  produto: String,
  quantidadeP: Number,
  quantidadeM: Number,
  quantidadeG: Number,
  quantidadeGG: Number,
  tem_arte: String,          // corrigido aqui
  descricao_arte: String,    // corrigido aqui
  nome: String,
  email: String,
  whatsapp: String,
  arquivo: String,
  data: { type: Date, default: Date.now }
});


const Pedido = mongoose.model('Pedido', pedidoSchema);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Upload de arquivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Página principal
app.get('/', (req, res) => {
  res.render('index');
});

// Endpoint de envio do formulário via AJAX
app.post('/pedido', upload.single('arquivo'), async (req, res) => {
  try {
    const pedido = new Pedido({
      produto: req.body.produto,
      quantidadeP: req.body.quantidadeP || 0,
      quantidadeM: req.body.quantidadeM || 0,
      quantidadeG: req.body.quantidadeG || 0,
      quantidadeGG: req.body.quantidadeGG || 0,
      tem_arte: req.body.tem_arte,
      descricao_arte: req.body.descricao_arte,
      nome: req.body.nome,
      email: req.body.email,
      whatsapp: req.body.whatsapp,
      arquivo: req.file ? req.file.filename : null
    });

    await pedido.save();
    res.status(200).json({ message: 'Pedido salvo com sucesso!' });
  } catch (err) {
    console.error('❌ Erro ao salvar pedido:', err);
    res.status(500).json({ error: 'Erro ao processar seu pedido.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
