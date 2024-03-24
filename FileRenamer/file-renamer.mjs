import * as fs from 'fs';
import * as path from 'path';
import { resolve } from 'path';

main();

function main() {
    if (process.argv.length < 3) {
        console.log('Geen pad beschikbaar');
        return;
    }

    const path = process.argv[2];
    if (!fs.existsSync(path)) {
        console.log('Pad bestaat niet');
        return;
    };

    const files = fs.readdirSync(path).sort();
    //console.table(files.filter(item => !item.includes('(') && !item.includes('[')));
    console.log(resolve(path, '../'));
}