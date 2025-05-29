const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Configurações
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Upload de arquivos (temporário)
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

// Rota do formulário
app.post('/pedido', upload.single('arquivo'), (req, res) => {
    const dados = {
        produto: req.body.produto,
        tamanho: req.body.tamanho,
        tem_arte: req.body.tem_arte,
        ideia: req.body.ideia,
        quantidade: req.body.quantidade,
        nome: req.body.nome,
        telefone: req.body.telefone,
        endereco: req.body.endereco,
        arquivo: req.file ? req.file.filename : null,
    };

    // Aqui podemos calcular preço, salvar em banco ou enviar por e-mail
    res.render('confirm', { dados });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Confirmação de rota ativa
console.log("Deploy atualizado em", new Date().toISOString());
