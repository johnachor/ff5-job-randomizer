import express from "express";
import { characters, jobSets } from "./constants.js";
import { getRandomElementFromArray } from "./utils.js";
const app = express();

let unlockState = 0;
let freelancerAllowed = false;

const basicGet = (req, res, next) => {
    const chosenCharacter = getRandomElementFromArray(characters);
    const chosenJob = getRandomElementFromArray(jobSets.flat());
    res.send(`Randomization time! Change ${chosenCharacter} to a ${chosenJob}!`);
};

const toggleFreelancer = (req, res, next) => {
    freelancerAllowed = !freelancerAllowed;
    res.send(`Freelancer allowed: ${freelancerAllowed}`);
}

const getAvailableJob = (req, res, next) => {
    const availableJobs = jobSets.slice(freelancerAllowed ? 0 : 1,unlockState + 1).flat();
    const chosenCharacter = getRandomElementFromArray(characters);
    const chosenJob = getRandomElementFromArray(availableJobs);
    res.send(`Randomization time! Change ${chosenCharacter} to a ${chosenJob}!`);
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
        res.send(`Progress logged! You've unlocked ${jobSets[unlockState].length} new jobs: ${jobSets[unlockState].join(", ")}`);
    }
};

app.get("/", basicGet);
app.get("/reset", resetProgression);
app.get("/unlock", progressGame);
app.get("/available", getAvailableJob);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
});