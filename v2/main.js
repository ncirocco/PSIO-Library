const START_BYTE = 49152;
const BULK_SIZE = 8192;
const PSX_ID_REGEX = /(SLPS|SLES|SLUS|SCPS|SCUS|SCES|SIPS|SLPM|SLEH|SLED|SCED|ESPM|PBPX)_\d{3}.\d{2}/;
const BIN_EXTENSION = 'bin';

var filesInfo = {};

if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    alert('The File APIs are not fully supported in this browser.');
}

function handleFiles(filesList) {
    filesInfo = {};

    [...filesList].forEach(function(file) {
        document.getElementById('fileContents').innerHTML = '';
        
        if (file.name.toLowerCase().includes('.' + BIN_EXTENSION)) {
            processBinFile(file);
        }
    });

    setTimeout(function () {
        console.log(filesInfo);

        for (var folder in filesInfo) {
            console.log(folder);
        }
    }, 1000);
}

function processBinFile(file) {
    for (var i = 0; i < 1; i++) {
        var blob = file.slice(START_BYTE + (BULK_SIZE * i), START_BYTE + (BULK_SIZE * i) + BULK_SIZE);
        
        var reader = new FileReader();
        reader.readAsBinaryString(blob);
        reader.onload = function (evt) {
            var gameId = evt.target.result.match(PSX_ID_REGEX);
            var filePath = file.webkitRelativePath.split('/').slice(0, -1).join('/');

            if (!gameId) {
                console.log('Game id not found for ' + filePath);
                return;
            }

            addFileToFiles({
                name: file.name,
                type: BIN_EXTENSION,
                path: filePath,
                gameId: gameId[0]
            });
        }

        reader.onerror = function (evt) {
            document.getElementById("fileContents").innerHTML = "error reading file";
        }
    }
}

function addFileToFiles(file) {
    if (!filesInfo[file.path]) {
        filesInfo[file.path] = [];
    }

    filesInfo[file.path].push(file);
}