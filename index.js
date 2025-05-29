require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado com sucesso'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

const PedidoSchema = new mongoose.Schema({
  produto: String,
  quantidades: { P: Number, M: Number, G: Number, GG: Number },
  temArte: String,
  descricaoArte: String,
  nome: String,
  email: String,
  whatsapp: String,
  data: { type: Date, default: Date.now }
});

const Pedido = mongoose.model('Pedido', PedidoSchema);

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/api/pedido', async (req, res) => {
  try {
    const pedido = new Pedido(req.body);
    await pedido.save();
    res.status(201).json({ message: 'Pedido salvo com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar pedido' });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Servidor rodando em http://localhost:${process.env.PORT}`)
);
