// Add this helper near the top of your script.js:
function getGroupColor(index, total) {
    // Generates visually distinct colors using HSL
    const hue = (index * 360 / total) % 360;
    return `hsl(${hue}, 70%, 60%)`;
}

// Update your renderGroups() function like this:
function renderGroups() {
    const container = document.getElementById('groupsContainer');
    container.innerHTML = currentGroups.map((group, groupIndex) => {
        const color = getGroupColor(groupIndex, currentGroups.length);
        return `
        <div class="group group${groupIndex + 1}" 
            data-group-index="${groupIndex}" 
            ondragover="event.preventDefault()" 
            ondrop="handleDrop(event, ${groupIndex})"
        >
            <div class="group-color-bar" style="background:${color}"></div>
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
        `;
    }).join('');
}