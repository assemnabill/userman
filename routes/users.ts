// import express from "express";
const express = require("express");
const router: express.Express = express();


let usersList: User[] = [];
usersList = [
    {
        "firstName": "Leanne",
        "lastName": "Bret",
        "email": "Sincere@april.biz",
        "password": "1-770-736-8031 x56442",
    },
    {
        "firstName": "Ervin",
        "lastName": "Antonette",
        "email": "Shanna@melissa.tv",
        "password": "010-692-6593 x09125",
    },
    {
        "firstName": "Clementine",
        "lastName": "Samantha",
        "email": "Nathan@yesenia.net",
        "password": "1-463-123-4447",
    },
    {
        "firstName": "Patricia",
        "lastName": "Karianne",
        "email": "Julianne.OConner@kory.org",
        "password": "493-170-9623 x156",
    },
    {
        "firstName": "Chelsey",
        "lastName": "Kamren",
        "email": "Lucio_Hettinger@annie.ca",
        "password": "(254)954-1289",
    },
    {
        "firstName": "Dennis",
        "lastName": "Leopoldo",
        "email": "Karley_Dach@jasper.info",
        "password": "1-477-935-8478 x6430",
    },
    {
        "firstName": "Kurtis",
        "lastName": "Elwyn",
        "email": "Telly.Hoeger@billy.biz",
        "password": "210.067.6132",
    },
    {
        "firstName": "Nicholas",
        "lastName": "Maxime_Nienow",
        "email": "Sherwood@rosamond.me",
        "password": "586.493.6943 x140",
    },
    {
        "firstName": "Glenna",
        "lastName": "Delphine",
        "email": "Chaim_McDermott@dana.io",
        "password": "(775)976-6794 x41206",
    },
    {
        "firstName": "Clementina",
        "lastName": "Stanton",
        "email": "Rey.Padberg@karina.biz",
        "password": "024-648-3804",
    }
]


router.get("/", (req: express.Request, res: express.Response) => {
    console.log(usersList);
    let tmp = usersList;
    tmp.forEach(u => delete u.password);
    res.send(tmp);
});

router.get("/:nr", (req: express.Request, res: express.Response) => {
    const nr = Number(req.params.nr);
    let userObj = usersList[nr];
    if (userObj) {
        let tmp = {
            firstName: userObj.firstName,
            lastName: userObj.lastName,
            email: userObj.email,
        }
        res.json(tmp);
    } else {
        res.status(500).send('Account not found.')
    }
});

router.post("/", (req: express.Request, res: express.Response) => {
    const userObj = req.body;
    let tmp = {
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        email: userObj.email,
        password: userObj.password,
    }
    usersList.push(tmp);
    res.json(tmp);
});


router.patch("/:nr", (req: express.Request, res: express.Response) => {
    const nr = Number(req.params.nr);
    const input = req.body;
    let userObj = usersList[nr];
    if (!userObj) {
        res.status(404).send('Account not found.')
    }
    userObj.firstName = input.firstName;
    userObj.lastName = input.lastName;
    userObj.email = input.email;
    res.json(userObj);

});


router.delete("/:nr", (req: express.Request, res: express.Response) => {
    const nr = Number(req.params.nr);
    let userObj = usersList[nr];
    if (userObj) {
        usersList.splice(nr, 1);
        res.json(userObj);
    }
});

module.exports = router;
