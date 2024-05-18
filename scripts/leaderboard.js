const MIN_LEADERBOARD_SCORE = 250;
const PANTRY_ENDPOINT = "https://getpantry.cloud/apiv1/pantry";

const DEV_MODE = false;
const LEADERBOARD_BASKET = DEV_MODE ? "testLeaderboard" : "leaderboard";

/** 
 * @typedef ScoreEntry
 * @property {string} username
 * @property {number} score
 */

/** Bind a connection from an external leaderboard API to a DOM element*/
class CloudLeaderboard {
    #parentElem;
    #cloudStore;

    constructor(parentElem, cloudStore) {
        this.#parentElem = parentElem;
        this.#cloudStore = cloudStore;
    }

    /**
     * Fetch the leaderboard data from Pantry, update the bound parent element
     * in the DOM.
     * On failure, a "Try Again" button is provided in the parent element.
     * @returns true if sucessful, false otherwise
     */
    async refresh() {
        this.#parentElem.innerHTML = "<p>Fetching leaderboard...<p>";
        try {
            const snapshot = await this.#cloudStore.fetchData(LEADERBOARD_BASKET);
            renderToDom(snapshot, this.#parentElem);
            return true;
        } catch (error) {
            this.#parentElem.innerHTML = `<p>${error}</p>`;

            const btn = append(this.#parentElem, "button");
            btn.textContent = "Try Again";
            btn.onclick = () => this.refresh();

            return false;
        }
    }

    async addEntry(username, score) {
        this.#parentElem.innerHTML = "<p>Saving new score...</p>"

        if (!await this.#cloudStore.add({ username, score }, LEADERBOARD_BASKET)) {
            return false;
        }

        console.log(`Saved: ${username} (${score})`);
        await this.refresh();

        return true;
    }
}

function renderToDom(leaderboard, elem) {
    if (leaderboard.length === 0) {
        elem.innerHTML = "<p>No Entries Found</p>";
        return;
    }

    leaderboard.sort((a, b) => b.score - a.score);

    elem.innerHTML = "";
    const table = append(elem, "table");
    const header = append(table, "tr");

    append(header, "th").textContent = "Rank"
    append(header, "th").textContent = "Player";
    append(header, "th").textContent = "Score";

    let count = 1;
    for (const entry of leaderboard) {
        const row = append(table, "tr");

        append(row, "td").textContent = count;
        append(row, "td").textContent = entry.username;
        append(row, "td").textContent = entry.score;
        count++;
    }
}

const I = 2 * 2 * 2 + 1;

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

function getPantryUri() {
    return (() => `${PANTRY_ENDPOINT}/${"9607bea3b7b-52f4c7097cd4-304f531311029f3c917529aa156ab70-8437359646386cad4-36498-290bbeb5be2fc32aaa8-019bdba6223b3f27c4f9-548f31fa40182b9f00809f-5f69fd67c562edd150b-c46c33c2e2167e16-bd59-d8e4-7b09-89264481_c58daec7dca60c-2095778a0a07c1c7-0decfc0-71f8-87df1edf69f3-65e0818b8c7-48690a5730c8-3947efc60b8a0f2df5-aa43f88ffe7f3c2d-371293266af073027-1f1f0bc3ca8ece453ba652ec20f431d788-1358f72d-9725a649a8da3d892686dec".substring((24 * (2 * 2 + 8)) / (12 - 10) + (5 * 5) / (I - 8), (F * 2) / (5 - 3) + ((4 + 2 * 2 * 2) * 12)).split("").reverse("").join("")}`)();
}

/**
 * @param {SubmitEvent} e
 * @param {number} score 
 */
function handleLeaderbaordForm(e, score) {
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
    leaderboardRef.addEntry(name, score);

    e.target.reset();
    // Disallow more than one entry per game
    e.target.onsubmit = () => false;
    e.target.style.display = "none";
}

const pantryStore = {
    fetchData: async (tableName) => {
        const response =
            await fetch(getPantryUri() + "/basket/" + tableName);

        if (response.status === 400) {
            return [];
        }
        if (!response.ok) {
            throw new Error(response.status);
        }

        const json = await response.json();
        // check elems, sort

        return json.entries;
    },

    add: async ({username, score}, tableName) => {
        const entries = await pantryStore.fetchData(tableName);
        const newEntries = entries.concat(
            [{ username: username, score: score }]
        );

        // Technically a data race could occur between these two calls to
        // fetch, although Pantry won't allow more than 2 requests per second

        const response = await fetch(
            getPantryUri() + "/basket/" + tableName, {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8"},
            body: JSON.stringify({ entries: newEntries })
        });

        return response.ok;
    }
}

const leaderboardRef = new CloudLeaderboard(
    document.getElementById("leaderboard"), pantryStore
);
