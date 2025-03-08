import express from "express";
import { characters, jobSets } from "./constants.js";
import { getRandomElementFromArray } from "./utils.js";
const app = express();

let unlockState = 0;

const basicGet = (req, res, next) => {
    const chosenCharacter = getRandomElementFromArray(characters);
    const chosenJob = getRandomElementFromArray(jobSets.flat());
    res.send(`Randomization time! Change ${chosenCharacter} to a ${chosenJob}!`);
};

const resetProgression = (req, res, next) => {
    unlockState = 0;
    res.send("Game progression has been reset. Let's go!")
};

const progressGame = (req, res, next) => {
    unlockState = unlockState + 1;
    res.send(`Progress logged! You've unlocked ${jobSets[unlockState]} new jobs!`);
};

app.get("/", basicGet);
app.get("/reset", resetProgression);
app.get("/unlock", progressGame);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
});