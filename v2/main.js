const START_BYTE = 49152;
const BULK_SIZE = 8192;
const PSX_ID_REGEX = /(SLPS|SLES|SLUS|SCPS|SCUS|SCES|SIPS|SLPM|SLEH|SLED|SCED|ESPM|PBPX)_\d{3}.\d{2}/;
const BIN_EXTENSION = '.bin';

if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    alert('The File APIs are not fully supported in this browser.');
}

function handleFiles(filesList) {
    [...filesList].forEach(function(file) {
        if (!file.name.toLowerCase().includes(BIN_EXTENSION)) {
            return;
        }

        document.getElementById("fileContents").innerHTML = '';

        for (var i = 0; i < 1; i++) {
            var blob = file.slice(START_BYTE + (BULK_SIZE * i), START_BYTE + (BULK_SIZE * i) + BULK_SIZE);
            
            var reader = new FileReader();
            reader.readAsBinaryString(blob);
            reader.onload = function (evt) {
                var gameId = evt.target.result.match(PSX_ID_REGEX);
                var filePath = file.webkitRelativePath.split('/').slice(0, -1).join('/');

                if (!gameId) {
                    document.getElementById("fileContents").innerHTML += '<br/>' + filePath + ' no found';    
                    
                    return;
                }

                document.getElementById("fileContents").innerHTML += '<br/>' + filePath + ' ' + gameId[0];
            }

            reader.onerror = function (evt) {
                document.getElementById("fileContents").innerHTML = "error reading file";
            }
        }
    })
}