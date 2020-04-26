const mysql = require('../mysql.js');

exports.getPedido = (req, res, next) => { 
    mysql.query(
        `SELECT pedido.id_pedido,
                pedido.quantidade,
                produto.id_produto,
                produto.nome,
                produto.preco
         FROM pedido
         INNER JOIN produto
         ON produto.id_produto = pedido.id_produto;`,
        (error, result, field) => {
            if (error) {
                return res.status(500).send({
                    error: error                    
                });
            }
            const response = {                
                pedidos: result.map(pedido => {
                    return {
                        id_pedido: pedido.id_pedido,
                        quantidade: pedido.quantidade,
                        produto: {
                            id_produto: pedido.id_produto,
                            nome: pedido.nome,
                            preco: pedido.preco
                        },                                            
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um pedido especifico',
                            url: process.env.URL_API + 'pedidos/' + pedido.id_pedido
                        }
                    }
                })
            };
            return res.status(200).send(response);
        }
    );
};

exports.postPedido = (req, res, next) => { 

    mysql.query(
        'SELECT * FROM produto WHERE id_produto = ?',
        [req.body.id_produto],
        (error, result, field) => {

            if (result.length === 0) {
                return res.status(404).send({
                    mensagem: 'Produto não encontrado'
                });
            }
            
            mysql.query(
                'INSERT INTO pedido (id_produto, quantidade) VALUES (?,?)',
                [req.body.id_produto, req.body.quantidade],
                (error, result, field) => {
                    if (error) {
                        return res.status(500).send({
                            error: error,
                            response: null
                        });
                    }
                    const response = {
                        mensagem: 'Pedido inserido com sucesso',
                        pedidoCriado: {
                            id_pedido: result.id_pedido,
                            id_produto: req.body.id_produto,
                            quantidade: req.body.quantidade,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os pedidos',
                                url: process.env.URL_API + 'pedidos' 
                            }
                        }
                    };
                    return res.status(201).send(response);
                }
            );

        }
    );
};

exports.getUmPedido = (req, res, next) => { 
    
    mysql.query(
        'SELECT * FROM pedido WHERE id_pedido = ?;',
        [req.params.id_pedido],
        (error, result, field) => {
            if (error) {
                return res.status(500).send({
                    error: error                    
                });
            }
            if (result.length === 0) {
                return res.status(404).send({
                    mensagem: 'Não foi encontrado pedido com ess ID'
                });
            }
            const response = {                
                pedido: {
                    id_pedido: result[0].id_pedido,
                    id_produto: result[0].id_produto,
                    quantidade: result[0].quantidade,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os pedidos',
                        url: process.env.URL_API + 'pedidos' 
                    }
                }
            };
            return res.status(200).send(response);
            
        }
    );
};

exports.deletePedido = (req, res, next) => { 
    mysql.query(
        'DELETE FROM pedido WHERE id_pedido = ?;',
        [req.body.id_pedido],
        (error, result, field) => {
            if (error) {
                return res.status(500).send({
                    error: error,
                    response: null
                });
            }
            const response = {
                mensagem: 'Produto removido com sucesso',
                request: {
                    tipo: 'POST',
                    descricao: 'Insere um pedido',
                    url: process.env.URL_API + 'pedidos',
                    body: {
                        id_produto: 'Number',
                        quantidade: 'Number'
                    }
                }
            }

            return res.status(202).send(response);
        }
    );
};
