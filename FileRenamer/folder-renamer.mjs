import * as fs from 'fs';
import * as path from 'path';

main();

function main() {
    if (process.argv.length < 3) {
        console.log('Geen pad beschikbaar');
        return;
    }

    const folder = process.argv[2];
    const dryRun = (process.argv.find(p => p === '-d') || []).length > 0;
    if (!fs.existsSync(folder)) {
        console.log(folder + ' is niet gevonden');
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
        .filter(file => file.stats.isDirectory())
        .sort();

    files.forEach(info => { renameFile(info, replacements); });
    const work = files.filter(f => f.source !== f.destination);

    if (dryRun) {
        console.table(work, ['source', 'destination']);
        console.log('dry run is specified, no files have been renamed');
    }
    else if (work.length == + 0) {
        console.log('no files have been renamed');
    }
    else {
        work.forEach(f => {
            const oldPath = path.resolve(folder, f.source);
            const newPath = path.resolve(folder, f.destination);
            console.log(`renaming ${oldPath} to ${newPath}`);

            fs.rename(oldPath, newPath, (err) => { });
        });

        console.log('done');
    }
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
