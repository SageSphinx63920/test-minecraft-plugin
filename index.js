const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const https = require('https');
const unzip = require('unzipper');

try {

    const software = core.getInput('server');
    console.log(`Server: ${software}!`);

    const version = core.getInput('version');
    console.log(`Version: ${version}`)

    const eula = core.getBooleanInput('eula');
    console.log('Eula ${eula')

    /*const time = (new Date()).toTimeString();
     core.setOutput("time", time);*/


    if (eula) {

        if (software === 'Bukkit') {


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
            unzip(`server.zip`, { overwrite: true }, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(`File unzipped!`);
            });



        } else
            console.log('Wrong input!')

    }


    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);


} catch (error) {
    core.setFailed(error.message);
}

