const express = require('express');
const app = express.Router();
const jwtCheck = require('../Controller/Auth/Auth.js');
const { query } = require('../Donnée/Connexion_DB.js');
const Redis = require('ioredis');
const dotenv = require('dotenv');
dotenv.config();
const redis = new Redis({ host: process.env.REDISHOST, port: process.env.REDISPORT });
// console.log(process.env.REDISHOST, process.env.REDISPORT);
// console.log(process.env.USER);
// console.log(redis);

app.use(express.json());
const logToRedis = async (message) => {
    const log = `[${new Date().toISOString()}] ${message}`;
    await redis.lpush('server:logs', log);
};

app.get('/redis-test', async (req, res) => {
    try {
        await redis.set('test', 'Hello Redis');
        const value = await redis.get('test');
        res.status(200).send({ message: 'Redis is working', value });
    } catch (err) {
        res.status(500).send({ message: 'Redis error', error: err });
    }
});

app.get('/alcool', async (req, res) => {
    try {
        const result = await query('SELECT shop_item.id, alcohol_id, shop_id, price, name, image FROM shop_item INNER JOIN alcohol ON alcohol.id = shop_item.alcohol_id;');
        if (result.rows.length === 0) {
            await logToRedis('GET /alcool -> Aucun alcool trouvé');
            return res.status(404).send({ message: 'Aucun alcool trouvé' });
        }
        await logToRedis(`GET /alcool -> ${result.rows.length} résultats`);
        res.status(200).send(result.rows);
    } catch (err) {
        await logToRedis(`GET /alcool -> Erreur SQL: ${err.message}`);
        res.status(500).send({ message: 'Erreur interne du serveur', error: err });
    }
});

app.get('/alcool/:id', async (req, res) => {
    try {
        const result = await query(
            'SELECT shop_item.id, alcohol_id, shop_id, price, type_alcohol_id, name, description, degree, capacity, image FROM shop_item INNER JOIN alcohol ON alcohol.id = shop_item.alcohol_id WHERE shop_item.alcohol_id = $1;',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            await logToRedis(`GET /alcool/${req.params.id} -> Aucun alcool trouvé`);
            return res.status(404).send({ message: 'Aucun alcool trouvé' });
        }
        await logToRedis(`GET /alcool/${req.params.id} -> 1 résultat`);
        res.status(200).send(result.rows[0]);
    } catch (err) {
        await logToRedis(`GET /alcool/${req.params.id} -> Erreur SQL: ${err.message}`);
        res.status(500).send({ message: 'Erreur interne du serveur', error: err });
    }
});

app.post('/alcool', async (req, res) => {
    const { type_alcohol_id, name, description, degree, capacity, image } = req.body;
    try {
        const result = await query(
            'INSERT INTO alcohol (type_alcohol_id, name, description, degree, capacity, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [type_alcohol_id, name, description, degree, capacity, image]
        );
        await logToRedis(`POST /alcool -> Alcool ajouté: ${name}`);
        res.status(201).send(result.rows[0]);
    } catch (err) {
        await logToRedis(`POST /alcool -> Erreur SQL: ${err.message}`);
        res.status(500).send({ message: 'Erreur interne du serveur', error: err });
    }
});

app.patch('/alcool/:id', async (req, res) => {
    const { type_alcohol_id, name, description, degree, capacity, image, id } = req.body;
    try {
        const result = await query(
            'UPDATE alcohol SET type_alcohol_id = $1, name = $2, description = $3, degree = $4, capacity = $5, image = $6 WHERE id = $7 RETURNING *',
            [type_alcohol_id, name, description, degree, capacity, image, id]
        );
        if (result.rows.length === 0) {
            await logToRedis(`PATCH /alcool/${req.params.id} -> Aucun alcool modifié`);
            return res.status(404).send({ message: 'Aucun alcool trouvé' });
        }
        await logToRedis(`PATCH /alcool/${req.params.id} -> Modifié: ${name}`);
        res.status(200).send(result.rows[0]);
    } catch (err) {
        await logToRedis(`PATCH /alcool/${req.params.id} -> Erreur SQL: ${err.message}`);
        res.status(500).send({ message: 'Erreur interne du serveur', error: err });
    }
});

app.delete('/alcool/:id', async (req, res) => {
    try {
        const result = await query('DELETE FROM shop_item WHERE id = $1', [req.params.id]);
        if (result.rowCount === 0) {
            await logToRedis(`DELETE /alcool/${req.params.id} -> Aucun alcool supprimé`);
            return res.status(404).send({ message: 'Aucun alcool trouvé' });
        }
        await logToRedis(`DELETE /alcool/${req.params.id} -> Supprimé`);
        res.status(204).send({ message: 'Alcool supprimé' });
    } catch (err) {
        await logToRedis(`DELETE /alcool/${req.params.id} -> Erreur SQL: ${err.message}`);
        res.status(500).send({ message: 'Erreur interne du serveur', error: err });
    }
});

module.exports = app;
