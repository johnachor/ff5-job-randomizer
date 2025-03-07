import express from "express";
import { characters, jobSets } from "./constants.js";
import { getRandomElementFromArray } from "./utils.js";
const app = express();

const basicGet = (req, res, next) => {
    const chosenCharacter = getRandomElementFromArray(characters);
    const chosenJob = getRandomElementFromArray(jobSets.flat());
    res.send(`Randomization time! Change ${chosenCharacter} to a ${chosenJob}!`);
};

app.get("/", basicGet);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
});