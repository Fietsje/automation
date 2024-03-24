import * as fs from 'fs';
import * as path from 'path';

main();

function main() {
    if (process.argv.length < 3) {
        console.log('Geen pad beschikbaar');
        return;
    }

    const folder = process.argv[2];
    if (!fs.existsSync(folder)) {
        console.log('Pad bestaat niet');
        return;
    };

    const replacements = [
        { start: '[', end: ']' },
        { start: '(', end: ')' }
    ];

    const files = fs.readdirSync(folder)
        .map(file => {
            const filePath = path.resolve(folder, file)
            return { source: file, destination: file, stats: fs.lstatSync(filePath) };
        })
        .filter(file => file.stats.isFile())
        .sort();

    files.forEach(info => { renameFile(info, replacements); });
    console.table(files);
}

function renameFile(info, replacements) {
    replacements.forEach(r => { applyReplacement(info, r); });
}

function applyReplacement(info, replacement) {
    const start = info.destination.indexOf(replacement.start);
    const end = info.destination.indexOf(replacement.end);

    if (start > -1 && end > -1) {
        const toRemove = info.destination.substring(start, end + 1);
        info.destination = info.destination.replace(toRemove, '').trim();
        applyReplacement(info, replacement);
    }
}
