import express from "express";
const app = express();

const basicGet = (req, res, next) => {
    res.send("It works bitch");
};

app.get("/", basicGet);

app.listen(42069, () => {
    console.log("Server running on port 42069")
});