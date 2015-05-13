var fs = require('fs');
var os = require('os');
var path = require('path');

// grab the 'exec function from the child_process module
var execSync = require('child_process').execSync;

var filePath = process.argv[2];
var allowedModifiedDate = process.argv[3];
var filteredList = [];

var ignoreList = [];
var badCharacters = [];

var _MILISECONDLIMIT = 5259490000;

ignoreList.push(".DS_Store");

badCharacters.push("&");
badCharacters.push("(");
badCharacters.push(")");
badCharacters.push("'");

if (filePath === undefined) {
	filePath = "./"
}

// default is 2 months before run date
if (allowedModifiedDate === undefined) {
	allowedModifiedDate = new Date();
}
else
{
	allowedModifiedDate = new Date(allowedModifiedDate);
}

filePath = path.normalize(filePath);
var tempFolder = filePath + "nodeCleanUp_GJ";
var newFile;


//console.log(filePath);

fs.readdir(filePath, function(err, data) {

	if (err) {
		throw err;
	}

	if (!fs.existsSync(tempFolder)){
			fs.mkdirSync(tempFolder);
	}

	/* this way sucks refactor this*/
	for (var i = 0; i < data.length; i++) {
		newFile = (filePath + data[i]);
		//console.log(newFile);

		var stats = fs.statSync(newFile);

		// check for permissions as well
		if (! stats.isDirectory() && ignoreList.indexOf(data[i]) === -1 && fileIsClean(data[i]) && fileIsOld(new Date(stats.mtime))) {
			newFile = (filePath + data[i]).replace(/ /g, '\\ ');
			//console.log(data[i] + ' ----- ' + stats.mtime + ": " + stats.isDirectory() + " Clean? " + fileIsClean(data[i]) + " Old? " + fileIsOld(new Date(stats.mtime)));
			MoveFile(newFile);
			//verifyFileMove(newFile);
		}
		
		
		
	}

	console.log("clean completed. please note that any files with '&' or '( )' characters will be ignored");
	process.exit(1);

});



//mv test/Blame\ Acapella\ .mp3 test/nodeCleanUp_GJ/
//mv test/Blame\ Acapella\ .mp3, test/nodeCleanUp_GJ/

function MoveFile(file) {
	//console.log(file);


	// check if process has permission to write to this file
	var moveCommand = 'mv ' + file + ' ' + tempFolder.replace(/ /g, '\\ '); + '/';

	console.log(moveCommand);
	
	var child = execSync(moveCommand);
}

function fileIsOld(fileLastModDate) {

	// 5.25949e9 miliseconds in 2 month
	var datediff = parseFloat(allowedModifiedDate - fileLastModDate);
	datediff = datediff + -1;

	if (datediff >= _MILISECONDLIMIT) {
		return true;
	}
	return false;

}

function fileIsClean(filename) {

	// 5.25949e9 miliseconds in 2 month
	for (var i = 0; i < badCharacters.length; i++) {
		if (filename.indexOf(badCharacters[i]) !== -1) {
			return false;
		}
	}
	return true;
}


function checkPermission(filename) {

	//if permission to move / rename, return true
}

function verifyFileMove(filename) {
	console.log(filename);
	var stats = fs.accessSync(filename, fs.R_OK | fs.W_OK);

	console.log(stats);
	process.exit(1);


}
//navigate to desktop

//scan files (exclude folders)
	// if file is 14 days old
		// check if cleanup folder exist
			// if not, create it
		// move file into folder