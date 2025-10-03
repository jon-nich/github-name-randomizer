function renderGroups() {
    const container = document.getElementById('groupsContainer');
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