/*
A script which collects all information about the current version and 
patch notes from package.json. The information is formatted and the 
repository is adjusted to the current version and merged onto the desired branch.
*/

var fs = require('fs');
const { exec } = require('child_process');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

const mergeBranch = 'main';

// read package.json into memory
const pkg = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8'));

// display banner
console.log(`
              __           __                   
.-----.-----.|  |.-----.--|  |.-----.-----.----.
|     |  _  ||  ||  -__|  _  ||  _  |  -__|   _|
|__|__|_____||__||_____|_____||___  |_____|__|  
                              |_____| 
`);
console.log('             Version Release \033[0;36m' + pkg.version + '\033[0m\n\n')

// gather all the patch notes
let notes = '';
for (let note of pkg.notes) {
    notes += `+ ${note}\n` 
}

// display all patch notes
console.log('\033[0;36m-------- Patch Notes --------\033[0m\n');
console.log(notes);

// display all changes
console.log('\033[0;36m-------- Differences --------\033[0m\n');
exec(` 
    git diff dev..main  
`,
(e, stdout, stderr) => {
    if (e) {
        console.log('an error occured:', e)
    }
    console.log(`${stdout}`);
    if (stderr) {
        console.log(`Git Error: ${stderr}`);
    }
})

setTimeout(async () => {

    // ask if to continue
    let response = "n";
    readline.question(`Are you sure you want to release to the ${mergeBranch} branch?`, 
        res => {
            if (res.toLowerCase() == "y") {
                response = res
            }
            readline.close()
        }
    )
    
    // continue on positive response
    if (response == "y") {

        console.log('\033[0;36m-------- Release --------\033[0m\n');
        
    
        // merge to main
        exec(` 
            cd ${__dirname}/../ && 
            git add . && 
            git commit -m 'release cleanu-up ${pkg.version}' &&
            git merge ${mergeBranch} -m ${notes} 
        `,
        (e, stdout, stderr) => {
            if (e) {
                console.log('an error occured:', e)
            }
            console.log(`Release Git Output: ${stdout}`);
            if (stderr) {
                console.log(`Release Git Error: ${stderr}`);
            } else {
                console.log('\033[0;36m Successfully merged.\033[0m\n');

                // read 
                p = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8'));
                
                // increment sub version after merge
                vArray = p.version.split('.');
                newSubVersion = parseInt(vArray[2]) + 1;
                newVersion = vArray.slice(0,2).join('.') + `.${newSubVersion}`;
                p.version = newVersion;
                
                // remove patch notes
                p.notes = [];

                // override JSON file
                let filename = __dirname + '/../package.json';
                fs.writeFile(filename, JSON.stringify(p), function writeJSON(err) {
                    if (err) return console.log(err);
                    console.log('Successfully reset package.json to fresh sub version.');
                })
            }
            
        });
    }
}, 1000)