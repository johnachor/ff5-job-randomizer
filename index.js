import express from "express";
import { characters, charactersPostSwap, jobSets, progressGates } from "./constants.js";
import { getRandomElementFromArray } from "./utils.js";

const app = express();

const gameState = {
    gateProgress: 1,
    freelancerAllowed: false,
    galufKrileSwapped: false,
    currentJobs: []
};

const setCharacterJob = (character, job) => {
    gameState.currentJobs = gameState.currentJobs
    .filter((charJob) => charJob.char !== character)
    .concat({char: character, job: job});
};

const swapGalufForKrile = (req, res, next) => {
    const galufJob = gameState.currentJobs.find(charJob => charJob.character === "Galuf").job;
    gameState.currentJobs = gameState.currentJobs
    .filter((charJob) => charJob.char !== "Galuf")
    .concat({char: "Krile", job: galufJob});
    res.send("RIP Galuf.");
};

const getAvailableJobs = () => jobSets.slice(gameState.freelancerAllowed ? 0 : 1, gameState.gateProgress + 1).flat();

const starterJobs = (req, res, next) => {
    gameState.gateProgress = 1;
    gameState.currentJobs = gameState.currentJobs.concat(characters.map(char => ({
        character: char,
        job: getRandomElementFromArray(getAvailableJobs())
    })));

    const jobStrings = gameState.currentJobs.map(charJob => `${charJob.character} is a ${charJob.job}.`)
    res.send(`New game, let's go! Here's your 4 starting jobs: ${jobStrings.join(" ")}`);
};

const toggleFreelancer = (req, res, next) => {
    gameState.freelancerAllowed = !gameState.freelancerAllowed;
    res.send(`Freelancer has been ${gameState.freelancerAllowed ? "enabled" : "disabled"}.`);
};

const randomizeSomeone = (req, res, next) => {
    const chosenCharacter = getRandomElementFromArray(gameState.galufKrileSwapped ? charactersPostSwap : characters);
    const chosenJob = getRandomElementFromArray(getAvailableJobs());
    setCharacterJob(chosenCharacter, chosenJob);
    res.send(`Randomization time! Change ${chosenCharacter} to ${chosenJob}!`);
};

const resetProgression = (req, res, next) => {
    gameState.gateProgress = 1;
    res.send("Game progression has been reset to gate 1 (Wind Crystal).");
};

const statusReport = (req, res, next) => {
    res.send(`Currently at gate ${gameState.gateProgress} (${progressGates[gameState.gateProgress]}). There are ${getAvailableJobs().length} jobs available. Freelancer is ${gameState.freelancerAllowed ? "enabled" : "disabled"}. Current jobs: ${gameState.currentJobs.map(charJob => `${charJob.character}: ${charJob.job}`).join(" | ")}`);
};

const progressGame = (req, res, next) => {
    if (gameState.gateProgress >= 6) {
        res.send("Progression is already maxed. Use !resetprogress or !newgame to start over.");
    } else {
        gameState.gateProgress += 1;
        res.send(`Progress logged! You're now at gate ${gameState.gateProgress} (${progressGates[gameState.gateProgress]}). Unlocked ${jobSets[gameState.gateProgress].length} new jobs: ${jobSets[gameState.gateProgress].join(", ")}`);
    }
};

const setCharJobExplicit = (req, res, next) => {
    console.log({char: req.query.char, job: req.query.job});
    const requestedChar = decodeURI(req.query.char);
    const requestedJob = decodeURI(req.query.job);
    const currentChars = gameState.galufKrileSwapped ? charactersPostSwap : characters;
    const caseCorrectedChar = currentChars.find(character => character.toLowerCase() === requestedChar.toLowerCase());
    const caseCorrectedJob = getAvailableJobs().find(availableJob => availableJob.toLowerCase() === requestedJob.toLowerCase());
    if (!caseCorrectedChar) {
        res.send(`Character name is not one of the current four: ${currentChars.join(" ")}`);
        return;
    }
    if (!caseCorrectedJob) {
        res.send(`Requested job not in currently available jobs: ${getAvailableJobs().join(", ")}`);
        return;
    }
    setCharacterJob(caseCorrectedChar, caseCorrectedJob);
    res.send(`${caseCorrectedChar} has been set to ${caseCorrectedJob}`);
};

app.get("/", statusReport);
app.get("/reset", resetProgression);
app.get("/progress", progressGame);
app.get("/randomize", randomizeSomeone);
app.get("/freelancer", toggleFreelancer);
app.get("/newgame", starterJobs);
app.get("/krileswap", swapGalufForKrile);
app.get("/explicit", setCharJobExplicit);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});