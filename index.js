import express from "express";
const app = express();

const basicGet = (req, res, next) => {
    res.send("It works bitch");
};

app.get("/", basicGet);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
});