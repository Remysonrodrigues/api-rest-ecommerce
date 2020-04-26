const express = require('express');
const router = express.Router();

const UsuarioController = require('../controllers/usuario-controller.js');

router.post('/cadastro', UsuarioController.postUsuario);
router.post('/login', UsuarioController.postLoginUsuario);

module.exports = router;