// app.js
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const connection = require("./connection");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => res.status(200).json({ message: "Hello World!" }));

app.post("/bookmarks", (req, res) => {
    const { url, title } = req.body;
    if (!url || !title) {
        return res.status(422).json({ error: "required field(s) missing" });
    }
    connection.query("INSERT INTO bookmark SET ?", req.body, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message,
                sql: err.sql,
            });
        } else {
            connection.query(
                "SELECT * FROM bookmark WHERE id = ?",
                results.insertId,
                (errBis, resultsBis) => {
                    if (errBis) {
                        return res.status(500).json({
                            error: errBis.message,
                            sql: errBis.sql,
                        });
                    } else {
                        const insertedBookmark = resultsBis[0];
                        return res.status(201).json(insertedBookmark);
                    }
                }
            );
        }
    });
});

app.get("/bookmarks/:id", (req, res) => {
    const idBookmark = req.params.id;
    connection.query(
        "SELECT * FROM bookmark WHERE id = ?", [idBookmark],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: err.message,
                    sql: err.sql,
                });
            } else if (results.length === 0) {
                return res.status(404).json({ error: "Bookmark not found" });
            } else {
                const insertedBookmark = results[0];
                return res.status(200).json(insertedBookmark);
            }
        }
    );
});

module.exports = app;