const MIN_LEADERBOARD_SCORE = 250;

/** 
 * @typedef ScoreEntry
 * @property {string} username
 * @property {number} score
 */

// Gracias a ChatGPT
const SAMPLE_DATA = [
    { username: "NebulaNomad", score: 735 },
    { username: "EnigmaWhisper", score: 730 },
    { username: "InfiniteInsomniac", score: 245 },
];

const getLeaderboard = newLeaderboard();

/**
 * @returns {() => ScoreEntry[]}
 */
function newLeaderboard() {
    let leaderboard = SAMPLE_DATA;
    return () => leaderboard;
}

/**
 * @param {string} username 
 * @param {number} score 
 */
function addToLeaderboard(username, score) {
    getLeaderboard().push({ username: username, score: score });
    getLeaderboard().sort((a, b) => b.score - a.score);
}

/**
 * @param {HTMLElement} parentElem 
 */
function leaderboardToDom(parentElem) {
    const sorted = [...getLeaderboard()].sort((a, b) => b.score - a.score);

    parentElem.innerHTML = "";
    const table = append(parentElem, "table");
    const header = append(table, "tr");

    append(header, "th").textContent = "Rank"
    append(header, "th").textContent = "Player";
    append(header, "th").textContent = "Score";

    let count = 1;
    for (const entry of sorted) {
        const row = append(table, "tr");

        append(row, "td").textContent = count;
        append(row, "td").textContent = entry.username;
        append(row, "td").textContent = entry.score;
        count++;
    }
}

/** @param {SubmitEvent} e  */
function handleLeaderbaordForm(e, score, outputElem) {
    e.preventDefault();

    if (score < MIN_LEADERBOARD_SCORE) {
        throw new RangeError(`Score is too low to submit to leaderboard: ${score}`)
    }

    const data = new FormData(e.target);
    const name = data.get("name");

    if (name === null) {
        alert("Field 'name' missing");
    }
    if (name.length < USERNAME_MIN || USERNAME_MAX < name.length) {
        alert(`Name must be between ${USERNAME_MIN}-${USERNAME_MAX} characters`);
        return;
    }
    addToLeaderboard(name, score);
    leaderboardToDom(outputElem);

    e.target.reset();
    // Disallow more than one entry per game
    e.target.onsubmit = () => false;
    e.target.style.display = "none";
}

/**
 * Create a new HTML element, append it to the parent
 * @param {HTMLElement} parentElem 
 * @param {string} tagName 
 * @returns reference to the new Element
 */
function append(parentElem, tagName) {
    const newElem = document.createElement(tagName);
    parentElem.append(newElem);

    return newElem;
}
