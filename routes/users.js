"use strict";
// import express from "express";
const express = require("express");
const router = express();
//import axios, {AxiosResponse} from "axios";
//const axios = require('axios');
router.get("/", (req, res) => {
    axios.get("https://jsonplaceholder.typicode.com/users")
        .then(value => {
        res.send(value);
    }).catch((reason) => {
        console.log(reason);
    });
});
router.post("/users", (req, res) => {
    const input = req.body.in;
    res.status(200);
    res.send("Echo: " + input);
});
router.get("/users/:nr", (req, res) => {
    const nr = Number(req.params.nr);
    const module = ["OOP", "DM", "AuD", "GDI", "WBS", "LA"];
    if (module[nr] !== undefined) {
        res.status(200);
        res.send(module[nr]);
    }
    else {
        res.sendStatus(404);
    }
});
module.exports = router;
