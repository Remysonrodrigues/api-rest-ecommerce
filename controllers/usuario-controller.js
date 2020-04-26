const mysql = require('../mysql.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

exports.postUsuario = (req, res, next) => {
    
    mysql.query(
        'SELECT * FROM usuario WHERE email = ?;',
        [req.body.email],
        (error, result) => {
            if (error) {
                return res.status(500).send({
                    error: error
                });
            }
            if (result.length > 0) {
                return res.status(409).send({
                    mensagem: 'Usuário já cadastrado'
                });
            } else {
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt) {
                        return res.status(500).send({
                            error: errBcrypt
                        });
                    }
                    mysql.query(
                        'INSERT INTO usuario (email, senha) VALUES (?,?)',
                        [req.body.email, hash],
                        (error, result) => {
                            if (error) {
                                return res.status(500).send({
                                    error: error
                                });
                            }
                            response = {
                                mensagem: 'Usuário criado com sucesso',
                                usuarioCriado: {
                                    id_usuario: result.insertId,
                                    email: req.body.email
                                }            
                            };
                            return res.status(201).send(response);
                        }
                    );
                });
            }
        }
    );
};

exports.postLoginUsuario = (req, res, next) => {
    
    mysql.query(
        'SELECT * FROM usuario WHERE email = ?;',
        [req.body.email],
        (error, results, field) => {
            if (error) {
                return res.status(500).send({
                    error: error
                });
            }
            if (results.length < 1) {
                return res.status(401).send({
                    mensagem: 'Falha na autenticação'
                });
            }
            bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
                if (err) {
                    return res.status(401).send({
                        mensagem: 'Falha na autenticação'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        id_usuario: results[0].id_usuario,
                        email: results[0].email
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '1h'
                    });
                    return res.status(200).send({
                        mensagem: 'Autenticado com sucesso',
                        token: token
                    });
                }
                return res.status(401).send({
                    mensagem: 'Falha na autenticação'
                });
            });
        }
    );
};