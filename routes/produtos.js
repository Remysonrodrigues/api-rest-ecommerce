const express = require('express');
const multer = require('multer'); 
const login = require('../middleware/login.js'); 
const router = express.Router();

const ProdutoController = require('../controllers/produto-controller.js');

const upload = multer({
    dest: './uploads'
});

router.get('/', ProdutoController.getProduto);
router.post('/', login.obrigatorio, upload.single('produto_imagem'), ProdutoController.postProduto);
router.get('/:id_produto', ProdutoController.getUmProduto);
router.patch('/', login.obrigatorio, ProdutoController.patchProduto);
router.delete('/', login.obrigatorio, ProdutoController.deleteProduto);

module.exports = router; 