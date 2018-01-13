console.log("starting Python web server");

const { exec } = require('child_process');

exec('python -m SimpleHTTPServer 8888', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
