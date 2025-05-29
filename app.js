require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB conectado com sucesso');
}).catch((err) => {
  console.error('Erro ao conectar no MongoDB:', err);
});

// Definindo schema
const pedidoSchema = new mongoose.Schema({
  produto: String,
  quantidadeP: Number,
  quantidadeM: Number,
  quantidadeG: Number,
  quantidadeGG: Number,
  tem_arte: String,
  descricao_arte: String,
  nome: String,
  email: String,
  whatsapp: String,
  arquivo: String,
  data: { type: Date, default: Date.now }
});
const Pedido = mongoose.model('Pedido', pedidoSchema);

// Configurações Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Rota principal
app.get('/', (req, res) => {
  res.render('index');
});

// Rota de envio do formulário
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
    res.redirect('/');
  } catch (err) {
    console.error('Erro ao salvar pedido:', err);
    res.status(500).send('Erro ao processar seu pedido.');
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
