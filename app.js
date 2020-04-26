const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

const rotaProdutos = require('./routes/produtos.js');
const rotaPedidos = require('./routes/pedidos.js');
const rotaUsuarios = require('./routes/usuarios.js');

app.use(morgan('dev')); 
app.use('/uploads', express.static('uploads')); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 

app.use( (req, res, next) => { 
    req.header('Access-Control-Allow-Origin', '*');
    req.header(
        'Access-Control-Allow-Header', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        req.header('Access-Control-Allow-Methods', 'PUT, POST, PACHT, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);
app.use('/usuarios', rotaUsuarios);

app.use( (req, res, next) => { 
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use( (error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;