// index.js
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const collection = require("./mongodb");

const templatePath = path.join(__dirname, "../templates");

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    try {
        // Sprawdzenie, czy istnieje użytkownik o podanym imieniu w bazie danych
        const existingUser = await collection.findOne({ name: req.body.name });
        if (existingUser) {
            return res.send("<script>alert('User already exists'); window.location.href='/signup';</script>");
        }

        const data = {
            name: req.body.name,
            password: req.body.password,
        };

        await collection.insertMany([data]);

        res.render("home");
    } catch (error) {
        console.error("Błąd podczas tworzenia konta:", error);
        res.send("Wystąpił błąd podczas tworzenia konta");
    }
});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.name });

        if (check.password === req.body.password) {
            res.render("home");
        } else {
            // Wyświetlenie alertu i przekierowanie na stronę logowania w przypadku nieprawidłowych informacji
            res.send("<script>alert('Wrong password'); window.location.href='/';</script>");
        }
    } catch (error) {
        console.error("Błąd podczas logowania:", error);
        res.send("<script>alert('An error occured'); window.location.href='/';</script>");
    }
});

app.listen(3000, () => {
    console.log("Port connected");
});
