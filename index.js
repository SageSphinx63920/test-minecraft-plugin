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

                    console.log(`File unzipped!`);

                    exec('cd server',
                        function (error, stdout, stderr) {
                            console.log('stdout: ' + stdout);
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            } else {

                                //This jvm flags are bad, but it works.
                                //I must check how i change the directory to the server folder.


                                //Start the minecraft server in the server directory.

                                let path = "server/";

                                exec(`java -DIReallyKnowWhatIAmDoingISwear -Dcom.mojang.eula.agree=true -jar server/server.jar --nogui --nojline --eraseCache -P ${path}plugins -S ${path}spigot.yml -b ${path}bukkit.yml -c ${path}server.properties -W ${path} -C ${path}commands.yml`,
                                    function (error, stdout, stderr) {
                                        console.log('stdout: ' + stdout);
                                        console.log('stderr: ' + stderr);
                                        if (error !== null) {
                                            console.log('exec error: ' + error);
                                        }
                                    });
                            }


                        });
                }, function (err) {
                    console.log(err);
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

