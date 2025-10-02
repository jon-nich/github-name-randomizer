// Default GitHub usernames (will be overwritten by CSV if uploaded or textarea used)
let githubUsers = [
    "jon-nich",
    "torvalds",
    "gaearon",
    "sindresorhus",
    "yyx990803",
    "getify",
    "tj",
    "dan-abramov",
    "hadley",
    "JakeWharton",
    "jakearchibald",
    "bkeepers",
    "defunkt",
    "mdo",
    "sarahedo",
    "kentcdodds",
    "wesbos",
    "thekitze",
    "rauchg",
    "jaredpalmer",
    "shiffman",
    "mxstbr",
    "ashleynolan",
    "cassidoo",
    "benjamn",
    "ljharb",
    "sebmarkbage",
    "joshwcomeau",
    "mjackson",
    "bgrins"
];

// Number of groups (default 6, but user can change)
let groupCount = 6;

// This variable holds the current group state for drag and drop
let currentGroups = [];

// Shared CSV/text parsing
function parseCSV(text) {
    let names = [];
    text = text.replace(/^\uFEFF/, '');
    let lines = text.split(/\r?\n/);
    for (let line of lines) {
        line = line.replace(/"/g, '').trim();
        if (!line) continue;
        if (line.includes(",")) {
            names.push(...line.split(",").map(n => n.trim()).filter(Boolean));
        } else {
            names.push(line);
        }
    }
    return [...new Set(names.filter(Boolean))];
}

// CSV import
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('csvInput').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (event) {
            const text = event.target.result;
            const parsed = parseCSV(text);
            if (parsed.length > 0) {
                githubUsers = parsed;
                shuffleGroups();
                document.getElementById("namesInput").value = parsed.join('\n');
            } else {
                alert("CSV file appears empty or could not be parsed.");
            }
        };
        reader.readAsText(file);
    });

    // Textarea: apply names
    document.getElementById("applyNamesBtn").addEventListener("click", function() {
        const text = document.getElementById("namesInput").value;
        const parsed = parseCSV(text);
        if (parsed.length > 0) {
            githubUsers = parsed;
            shuffleGroups();
        } else {
            alert("No valid names found in input.");
        }
    });

    // Group controls
    document.getElementById("addGroupBtn").addEventListener("click", function() {
        groupCount++;
        updateTeamCountDisplay();
        shuffleGroups();
    });
    document.getElementById("removeGroupBtn").addEventListener("click", function() {
        if (groupCount > 1) {
            groupCount--;
            updateTeamCountDisplay();
            shuffleGroups();
        }
    });

    // Initial shuffle and render
    updateTeamCountDisplay();
    shuffleGroups();
});

function updateTeamCountDisplay() {
    document.getElementById("teamCount").textContent = groupCount;
}

// Shuffle logic
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function createGroups() {
    const shuffledUsers = shuffleArray(githubUsers);
    const groups = Array.from({length: groupCount}, () => []);
    shuffledUsers.forEach((user, i) => {
        groups[i % groupCount].push(user);
    });
    return groups;
}

// Renders groups from currentGroups (not from random shuffle)
function renderGroups() {
    const container = document.getElementById('groupsContainer');
    container.innerHTML = currentGroups.map((group, groupIndex) => `
        <div class="group group${groupIndex + 1}" 
            data-group-index="${groupIndex}" 
            ondragover="event.preventDefault()" 
            ondrop="handleDrop(event, ${groupIndex})"
        >
            <div class="group-title">
                Team ${groupIndex + 1}
            </div>
            ${group.map((username, studentIndex) => `
                <a 
                    class="student-card" 
                    href="https://github.com/${username}" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    draggable="true"
                    data-group-index="${groupIndex}"
                    data-student-index="${studentIndex}"
                    ondragstart="handleDragStart(event, ${groupIndex}, ${studentIndex})"
                >
                    ${username}
                </a>
            `).join('')}
        </div>
    `).join('');
}

// Shuffle and update currentGroups, then render
function shuffleGroups() {
    currentGroups = createGroups();
    renderGroups();
}

// Drag and drop handlers (need to be global for inline HTML event handlers)
window.handleDragStart = function(event, groupIndex, studentIndex) {
    event.dataTransfer.setData("text/plain", JSON.stringify({ groupIndex, studentIndex }));
};
window.handleDrop = function(event, destGroupIndex) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    if (!data) return;
    const { groupIndex: srcGroupIndex, studentIndex: srcStudentIndex } = JSON.parse(data);

    if (typeof srcGroupIndex !== "number" || typeof srcStudentIndex !== "number") return;
    if (srcGroupIndex === destGroupIndex) return; // Don't drop onto same group

    const username = currentGroups[srcGroupIndex][srcStudentIndex];
    currentGroups[srcGroupIndex].splice(srcStudentIndex, 1);
    currentGroups[destGroupIndex].push(username);

    renderGroups();
};