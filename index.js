const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const https = require('https');
const unzip = require('unzipper');
const exec = require('child_process').exec;

try {

    const software = core.getInput('server');
    console.log(`Server: ${software}!`);

    const version = core.getInput('version');
    console.log(`Version: ${version}`)

    const eula = core.getBooleanInput('eula');
    console.log('Eula ${eula}')

    /*const time = (new Date()).toTimeString();
     core.setOutput("time", time);*/


    if (eula) {

        if (software === 'Spigot') {


            https.get("https://img.sagesphinx63920.dev/f.php?h=1_V098XJFwoI&d=1", (res) => {

                // Open file in local filesystem
                const file = fs.createWriteStream(`server.zip`);

                // Write data into local file
                res.pipe(file);

                // Close the file
                file.on('finish', () => {
                    file.close();
                    console.log(`File downloaded!`);
                });

            }).on("error", (err) => {
                console.log("Error: ", err.message);
            });

            //Unzip the file
            unzip.Extract({ path: './' }, `server.zip`);
            console.log(`File unzipped!`);


            exec(`ls`, (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(stdout);
            });

            exec('java -DIReallyKnowWhatIAmDoingISwear -jar server.jar --nogui --nojline --eraseCache --log-strip-color',
                function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });



        } else
            console.log('Wrong input!')

    }


} catch (error) {
    core.setFailed(error.message);
}

