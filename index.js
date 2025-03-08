import express from "express";
import { characters, jobSets, progressGates } from "./constants.js";
import { getRandomElementFromArray } from "./utils.js";
const app = express();

let unlockState = 1;
let freelancerAllowed = false;

const getAvailableJobs = () => jobSets.slice(freelancerAllowed ? 0 : 1,unlockState + 1).flat();

const starterJobs = (req, res, next) => {
    unlockState = 1;
    const jobs = characters.map(char => `${char}: ${getRandomElementFromArray(jobSets[1])}`);
    res.send(`New game, let's go! Here's your 4 starting jobs: ${jobs.join(" | ")}`);
};

const toggleFreelancer = (req, res, next) => {
    freelancerAllowed = !freelancerAllowed;
    res.send(`Freelancer allowed: ${freelancerAllowed}`);
};

const randomizeSomeone = (req, res, next) => {
    const chosenCharacter = getRandomElementFromArray(characters);
    const chosenJob = getRandomElementFromArray(getAvailableJobs());
    res.send(`Randomization time! Change ${chosenCharacter} to ${chosenJob}!`);
};

const resetProgression = (req, res, next) => {
    unlockState = 1;
    res.send("Game progression has been reset to gate 1 (Wind Crystal).");
};

const statusReport = (req, res, next) => {
    res.send(`Currently at gate ${unlockState} (${progressGates[unlockState]}). There are ${getAvailableJobs().length} jobs available.`);
};

const progressGame = (req, res, next) => {
    if (unlockState >= 6) {
        res.send("Progression is already maxed. Use !resetprogress or !newgame to start over.");
    } else {
        unlockState = unlockState + 1;
        res.send(`Progress logged! You're now at gate ${unlockState} (${progressGates[unlockState]}). Unlocked ${jobSets[unlockState].length} new jobs: ${jobSets[unlockState].join(", ")}`);
    }
};

app.get("/", statusReport);
app.get("/reset", resetProgression);
app.get("/unlock", progressGame);
app.get("/available", randomizeSomeone);
app.get("/freelancer", toggleFreelancer);
app.get("/newgame", starterJobs);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
});