const express = require('express');
const router = express.Router();

const PedidosContorller = require('../controllers/pedido-controller.js');

router.get('/', PedidosContorller.getPedido);
router.post('/', PedidosContorller.postPedido);
router.get('/:id_pedido', PedidosContorller.getUmPedido);
router.delete('/:id_pedido', PedidosContorller.deletePedido);

module.exports = router; 