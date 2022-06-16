const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const https = require('https');
const zl = require("zip-lib");
const exec = require('child_process').exec;

//try {

    const software = "Spigot"; //core.getInput('server');
    console.log(`Server: ${software}`);

    const version = "Latest"; //core.getInput('version');
    console.log(`Version: ${version}`);

    const eula = true; //core.getBooleanInput('eula');
    console.log(`Eula: ${eula}`);

    /*const time = (new Date()).toTimeString();
     core.setOutput("time", time);*/


    if (eula) {

        if (software === 'Spigot') {


            https.get("https://img.sagesphinx63920.dev/f.php?h=1_V098XJFwoI&d=1", (res) => {

                // Open file in local filesystem
                const file = fs.createWriteStream(`server.zip`);

                // Write data into local file
                res.pipe(file);

                console.log("Downloading the server... This may take a while...");

                // Close the file
                file.on('finish', () => {
                    file.close();
                    console.log(`File downloaded!`);

                    //Unzip the contents of the zip folder with zlib
                    const unzip = new zl.Unzip({
                        // Called before an item is extracted.
                        onEntry: function (event) {
                            console.log(event.entryCount, event.entryName);
                        }
                    });

                    unzip.extract("server.zip", "server").then(function () {
                        console.log("done");
                    }, function (err) {
                        console.log(err);
                    });

                    console.log(`File unzipped!`);


                    exec(`ls`, (err, stdout, stderr) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log(stdout);
                    });

                    exec('java -DIReallyKnowWhatIAmDoingISwear -jar server/server.jar --nogui --nojline --eraseCache --log-strip-color',
                        function (error, stdout, stderr) {
                            console.log('stdout: ' + stdout);
                            console.log('stderr: ' + stderr);
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            }
                        });
                });


            }).on("error", (err) => {
                console.log("Error: ", err.message);
            });





        } else
            console.log('Wrong input!')

    }


/*} catch (error) {
    core.setFailed(error.message);
}*/

