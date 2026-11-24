const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 8080;

app.use(express.json());

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: process.env.DB_PASSORD,
    database: "elevdatabase"
});

app.get("/byer", async (req, res) => {
    const resultat = await pool.query("SELECT by_id, by_navn, borgermester FROM by");
    res.json(resultat.rows);
});

app.get("/brukere", async (req, res) => {
    const resultat = await pool.query(`
        SELECT b.bruker_id, b.fornavn, b.etternavn, y.by_navn, y.borgermester
        FROM bruker b
        JOIN by y ON b.by_id = y.by_id
        ORDER BY b.etternavn, b.fornavn
    `);
    res.json(resultat.rows);
});

app.post("/brukere", async (req, res) => {
    const { fornavn, etternavn, epost, by_id } = req.body || {};

    if (!fornavn || !etternavn || !epost || !by_id) {
        return res.status(400).json({
            feil: "Du må sende med fornavn, etternavn, epost og by_id"
        });
    }

    const resultat = await pool.query(
        "INSERT INTO bruker (fornavn, etternavn, epost, by_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [fornavn, etternavn, epost, by_id]
    );

    res.status(201).json(resultat.rows[0]);
});

app.delete("/brukere/:id", async (req, res) => {
    const id = req.params.id;

    const resultat = await pool.query(
        "DELETE FROM bruker WHERE bruker_id = $1 RETURNING *",
        [id]
    );

    const bruker = resultat.rows[0];
    res.json({ melding: `Slettet ${bruker.fornavn} ${bruker.etternavn}` });
});

app.listen(port, () => {
    console.log("TESTSERVER kjører på port " + port);
});