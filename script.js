// Default GitHub usernames (placeholder names)
let githubUsers = [
    "jon-nich", "torvalds", "gaearon", "sindresorhus", "yyx990803", "getify",
    "tj", "dan-abramov", "hadley", "JakeWharton", "jakearchibald", "bkeepers",
    "defunkt", "mdo", "sarahedo", "kentcdodds", "wesbos", "thekitze", "rauchg",
    "jaredpalmer", "shiffman", "mxstbr", "ashleynolan", "cassidoo", "benjamn",
    "ljharb", "sebmarkbage", "joshwcomeau", "mjackson", "bgrins"
];

let groupCount = 6; // Default number of teams
let currentGroups = [];

// Parse CSV or textarea
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

// Color for each group
function getGroupColor(index, total) {
    const hue = (index * 360 / total) % 360;
    return `hsl(${hue}, 70%, 60%)`;
}

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Create groups
function createGroups() {
    const shuffledUsers = shuffleArray(githubUsers);
    const groups = Array.from({length: groupCount}, () => []);
    shuffledUsers.forEach((user, i) => {
        groups[i % groupCount].push(user);
    });
    return groups;
}

// Render groups as cards with drag-and-drop
function renderGroups() {
    const container = document.getElementById('groupsContainer');
    if (!currentGroups.length || !currentGroups.some(g => g.length > 0)) {
        container.innerHTML = "<p>No names loaded yet.</p>";
        return;
    }
    container.innerHTML = `<div class="groups-row">${
        currentGroups.map((group, groupIndex) => {
            const color = getGroupColor(groupIndex, currentGroups.length);
            return `
            <div class="group"
                data-group-index="${groupIndex}" 
                ondragover="event.preventDefault()" 
                ondrop="handleDrop(event, ${groupIndex})"
            >
                <div class="group-color-bar" style="background:${color}"></div>
                <div class="group-title">Team ${groupIndex + 1}</div>
                ${group.map((username, studentIndex) => `
                    <div 
                        class="student-card" 
                        draggable="true"
                        data-group-index="${groupIndex}"
                        data-student-index="${studentIndex}"
                        ondragstart="handleDragStart(event, ${groupIndex}, ${studentIndex})"
                    >
                        ${username}
                    </div>
                `).join('')}
            </div>
            `;
        }).join('')
    }</div>`;
}

// Shuffle and render
function shuffleGroups() {
    currentGroups = createGroups();
    renderGroups();
}

// Team count display (optional)
function updateTeamCountDisplay() {
    const teamCountSpan = document.getElementById("teamCount");
    if (teamCountSpan) teamCountSpan.textContent = groupCount;
}

// Drag and drop handlers
window.handleDragStart = function(event, groupIndex, studentIndex) {
    event.dataTransfer.setData("text/plain", JSON.stringify({ groupIndex, studentIndex }));
};
window.handleDrop = function(event, destGroupIndex) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    if (!data) return;
    const { groupIndex: srcGroupIndex, studentIndex: srcStudentIndex } = JSON.parse(data);

    if (typeof srcGroupIndex !== "number" || typeof srcStudentIndex !== "number") return;
    if (srcGroupIndex === destGroupIndex) return; // don't drop onto same group

    const username = currentGroups[srcGroupIndex][srcStudentIndex];
    currentGroups[srcGroupIndex].splice(srcStudentIndex, 1);
    currentGroups[destGroupIndex].push(username);

    renderGroups();
};

// DOM loaded: attach events and show initial cards
document.addEventListener("DOMContentLoaded", function() {
    // CSV file input
    const csvInput = document.getElementById('csvInput');
    if (csvInput) {
        csvInput.addEventListener('change', function (e) {
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
    }

    // Textarea: apply names
    const applyBtn = document.getElementById("applyNamesBtn");
    if (applyBtn) {
        applyBtn.addEventListener("click", function() {
            const text = document.getElementById("namesInput").value;
            const parsed = parseCSV(text);
            if (parsed.length > 0) {
                githubUsers = parsed;
                shuffleGroups();
            } else {
                alert("No valid names found in input.");
            }
        });
    }

    // Group controls
    const addGroupBtn = document.getElementById("addGroupBtn");
    if (addGroupBtn) {
        addGroupBtn.addEventListener("click", function() {
            groupCount++;
            updateTeamCountDisplay();
            shuffleGroups();
        });
    }
    const removeGroupBtn = document.getElementById("removeGroupBtn");
    if (removeGroupBtn) {
        removeGroupBtn.addEventListener("click", function() {
            if (groupCount > 1) {
                groupCount--;
                updateTeamCountDisplay();
                shuffleGroups();
            }
        });
    }

    const shuffleTeamsBtn = document.getElementById("shuffleTeamsBtn");
    if (shuffleTeamsBtn) {
        shuffleTeamsBtn.addEventListener("click", function() {
            shuffleGroups();
        });
    }

    updateTeamCountDisplay();
    shuffleGroups(); // KEY: Show teams/cards as soon as page loads
});