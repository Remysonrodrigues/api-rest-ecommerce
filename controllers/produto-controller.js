const mysql = require('../mysql.js');

exports.getProduto = (req, res, next) => { 
    
    mysql.query(
        'SELECT * FROM produto;',
        (error, result, field) => {
            if (error) {
                return res.status(500).send({
                    error: error                    
                });
            }
            const response = {
                quantidade: result.length,
                produto: result.map(prod => {
                    return {
                        id_produto: prod.id_produto,
                        nome: prod.nome,
                        preco: prod.preco,
                        imagem_produto: prod.imagem_produto,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um produto especifico',
                            url: process.env.URL_API + 'produtos/' + prod.id_produto
                        }
                    }
                })
            };
            return res.status(200).send(response);
        }
    );
};

exports.postProduto = (req, res, next) => {

    mysql.query(
        'INSERT INTO produto (nome, preco, imagem_produto) VALUES (?,?,?)',
        [req.body.nome, req.body.preco, req.file.path],
        (error, result, field) => {
            if (error) {
                return res.status(500).send({
                    error: error
                });
            }
            const response = {
                mensagem: 'Produto inserido com sucesso',
                produtoCriado: {
                    id_produto: result.inserId,
                    nome: req.body.nome,
                    preco: req.body.preco,
                    imagem_produto: req.file.path,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos',
                        url: process.env.URL_API + 'produtos' 
                    }
                }
            };
            return res.status(201).send(response);
        }
    ); 
};

exports.getUmProduto = (req, res, next) => { 
    
    mysql.query(
        'SELECT * FROM produto WHERE id_produto = ?;',
        [req.params.id_produto],
        (error, result, field) => {
            if (error) {
                return res.status(500).send({
                    error: error                    
                });
            }
            if (result.length === 0) {
                return res.status(404).send({
                    mensagem: 'Não foi encontrado produto com ess ID'
                });
            }
            const response = {                
                produto: {
                    id_produto: result[0].id_produto,
                    nome: result[0].nome,
                    preco: result[0].preco,
                    imagem_produto: result[0].imagem_produto,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos',
                        url: process.env.URL_API + 'produtos' 
                    }
                }
            };
            return res.status(200).send(response);
            
        }
    );
};

exports.patchProduto = (req, res, next) => { 
    
    mysql.query(
        'UPDATE produto SET nome = ?, preco = ? WHERE id_produto = ?',
        [req.body.nome, req.body.preco, req.body.id_produto],
        (error, result, field) => {            
            if (error) {
                return res.status(500).send({
                    error: error,
                    response: null
                });
            }
            const response = {
                mensagem: 'Produto atualizado com sucesso',
                produtoAtualizado: {
                    id_produto: req.body.id_produto,
                    nome: req.body.nome,
                    preco: req.body.preco,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna os detalhes de um produto especifico',
                        url: process.env.URL_API + 'produtos/' + req.body.id_produto
                    }
                }
            };
            return res.status(202).send(response);
        }
    );
};

exports.deleteProduto = (req, res, next) => { 
    
    mysql.query(
        'DELETE FROM produto WHERE id_produto = ?;',
        [req.body.id_produto],
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
                    descricao: 'Insere um produto',
                    url: process.env.URL_API + 'produtos',
                    body: {
                        nome: 'String',
                        preco: 'Number'
                    }
                }
            }

            return res.status(202).send(response);
        }
    );
};