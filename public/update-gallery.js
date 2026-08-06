const fs = require('fs');
const path = require('path');

const artDir = path.join(__dirname, 'assets', 'art');
const jsonPath = path.join(__dirname, 'art.json');

fs.readdir(artDir, (err, files) => {
    if (err) {
        console.error("Could not list the art directory.", err);
        process.exit(1);
    }

    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
    const images = files.filter(file => imageExtensions.includes(path.extname(file).toLowerCase()));

    function extractDate(filename) {
        const match = filename.match(/\(([^)]+)\)/);
        if (match) {
            const parsedDate = new Date(match[1]);
            if (!isNaN(parsedDate)) return parsedDate;
        }
        try {
            return fs.statSync(path.join(artDir, filename)).mtime;
        } catch {
            return new Date(0);
        }
    }

    // Sort newest first
    images.sort((a, b) => extractDate(b) - extractDate(a));

    // Map into clean JSON data objects
    const artData = images.map(img => {
        let titleName = path.basename(img, path.extname(img)).replace(/-/g, ' ');
        return {
            filename: img,
            title: titleName,
            path: `assets/art/${img}`
        };
    });

    // Write to art.json
    fs.writeFile(jsonPath, JSON.stringify(artData, null, 2), 'utf8', (err) => {
        if (err) {
            console.error("Could not write art.json", err);
        } else {
            console.log(`✨ Success! Generated art.json with ${artData.length} sorted pieces.`);
        }
    });
});