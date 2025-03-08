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

const getAvailableJob = (req, res, next) => {
    res.send(`Available jobs: ${jobSets.slice(0,unlockState).flat()}`)
};

const resetProgression = (req, res, next) => {
    unlockState = 0;
    res.send("Game progression has been reset. Let's go!")
};

const progressGame = (req, res, next) => {
    if (unlockState >= 6) {
        res.send("Progression is already maxed. Use !resetjobs to start over.");
    } else {
        unlockState = unlockState + 1;
        res.send(`Progress logged! You've unlocked ${jobSets[unlockState]} new jobs!`);
    }
};

app.get("/", basicGet);
app.get("/reset", resetProgression);
app.get("/unlock", progressGame);
app.get("/available", getAvailableJob);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
});