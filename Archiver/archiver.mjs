import * as fs from 'fs';
import * as path from 'path';

(function () {
    const dryRun = (process.argv.find(p => p === '-d') || []).length > 0;
    if (!!dryRun) {
        console.log('running dry, no changes will be made');
    }

    if (process.argv.length < 4) {
        console.log('Missing parameters, add 2 paths');
        return;
    }

    const sourcefolder = process.argv[2];
    if (!fs.existsSync(sourcefolder)) {
        console.log(sourcefolder + ' is not found');
        return;
    };

    const destinationfolder = process.argv[3];
    if (!fs.existsSync(destinationfolder)) {
        console.log(destinationfolder + ' is not found');
        return;
    };

    const directories = fs.readdirSync(destinationfolder)
        .map(file => {
            const filePath = path.resolve(destinationfolder, file)
            return { source: file, stats: fs.lstatSync(filePath) };
        })
        .filter(file => file.stats.isDirectory())
        .map(file => file.source)
        .sort();

    const files = fs.readdirSync(sourcefolder)
        .map(file => {
            const filePath = path.resolve(sourcefolder, file)
            return { source: file, destination: file, stats: fs.lstatSync(filePath), fullPath: filePath };
        })
        .filter(file => file.stats.isFile())
        .sort();

    for (let index = 0; index < directories.length; index++) {
        const foldername = directories[index].toLowerCase().replace(' ', '_');

        const selectedFiles = files.filter(f => f.source.includes('by_' + foldername));
        if (selectedFiles.length > 0) {
            console.log('dst', foldername, selectedFiles.length);

            for (let index = 0; index < selectedFiles.length; index++) {
                const fileinfo = selectedFiles[index];
                fileinfo.destination = destinationfolder + '\\' + foldername + '\\' + fileinfo.source;

                console.log(fileinfo.fullPath, '->', fileinfo.destination);
                if (!dryRun) {
                    if (fs.existsSync(fileinfo.destination)) {
                        fs.rename(fileinfo.fullPath, sourcefolder + '\\temp' + fileinfo.source, err => {/** Ignore error */ });
                    }
                    fs.rename(fileinfo.fullPath, fileinfo.destination, err => { /** Ignore error */ });
                }
            }
        }
    }

})();