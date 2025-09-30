# GitHub Name Randomizer

A colorful, interactive web application for randomly organizing GitHub usernames into teams.  
Now supports importing a CSV file with names or usernames!

## Features

- 🐙 **GitHub-Focused**: Each team is made up of clickable GitHub usernames
- 🔀 **Random Shuffling**: Click the shuffle button to create new random teams
- 📂 **CSV Import**: Upload a CSV file to use your own list of names/usernames
- 🎨 **Colorful Design**: Each team has its own color theme
- 📱 **Responsive Layout**: Works on desktop, tablet, and mobile devices
- 🎯 **Slide-Friendly**: 2x3 grid layout optimized for presentations

## Usage

1. Open `index.html` in your web browser
2. (Optional) Click "Import CSV" and upload a file with one name/username per line, or comma-separated
3. Click "🔀 Shuffle Teams" to create new random teamings

## Customization

### Adding/Removing GitHub Users manually
Edit the `githubUsers` array in `script.js`:
```javascript
let githubUsers = [
    "username1",
    "username2",
    // Add or remove usernames as needed
];
```

### Using a CSV file
- Simply upload a CSV with one entry per line, or comma-separated.
- Example:
    ```
    jon-nich,torvalds,gaearon
    sindresorhus
    ```
- Names will be used exactly as written.

### Changing Team Sizes
Modify the `createGroups()` function in `script.js` to adjust how users are distributed among teams.

### Styling
Edit `styles.css` to customize colors, fonts, and layout.

## File Structure
```
github-name-randomizer/
├── index.html      # Main HTML structure
├── styles.css      # Styling and layout
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

## License
Free to use and modify for educational purposes.