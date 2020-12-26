// import express from "express";
const express = require("express");
const router: express.Express = express();
//import axios, {AxiosResponse} from "axios";
//const axios = require('axios');



router.get("/", (req: express.Request, res: express.Response) => {
    axios.get("https://jsonplaceholder.typicode.com/users")
        .then(value => {
            res.send(value);
        }).catch((reason: any) => {
            console.log(reason);
    });
});

router.post("/users", (req: express.Request, res: express.Response) => {
    const input: string = req.body.in;
    res.status(200);
    res.send("Echo: " + input);
});

router.get("/users/:nr", (req: express.Request, res: express.Response) => {
    const nr: number = Number(req.params.nr);
    const module: string[] = ["OOP", "DM", "AuD", "GDI", "WBS", "LA"];

    if(module[nr] !== undefined) {
        res.status(200);
        res.send(module[nr]);
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;
