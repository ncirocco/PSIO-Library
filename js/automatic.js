const START_BYTE = 49152;
const BULK_SIZE = 8192;

const PSX_ID_REGEX = /(SLPS|SLES|SLUS|SCPS|SCUS|SCES|SIPS|SLPM|SLEH|SLED|SCED|ESPM|PBPX)_\d{3}.\d{2}/;

const BIN_EXTENSION = 'bin';
const BMP_EXTENSION = 'bmp';

const COVER_IMAGE_NAME = 'cover.bmp';
const COVERS_PATH = 'images/covers_by_id';

const ZIP_FILE_NAME = 'psio.zip';

var filesInfo;

if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    alert('This browser is incompatible with the website. Please download Chrome or Firefox.');
}

function handleFiles(filesList) {
    document.getElementById("idNotFound").innerHTML = '';
    document.getElementById("imageNotFound").innerHTML = '';
    document.getElementById("wait").innerHTML = '';

    filesInfo = {};

    [...filesList].forEach(function(file) {
        if (file.name.toLowerCase().includes('.' + BIN_EXTENSION)) {
            processBinFile(file);
        }
    });

    setTimeout(function () {
        var folderCovers = prepareFolderCovers();

        var coversToBeZipped = [];
        for (folder in folderCovers) {
            coversToBeZipped.push({
                folder: folder,
                file: folderCovers[folder]
            })
        }
        document.getElementById("wait").innerHTML = 'Preparing ZIP file. Please wait...';
        addCoversToZipAndDownload(new JSZip(), coversToBeZipped);
    }, 1000);
}

function addCoversToZipAndDownload(zip, coversToBeZipped) {
    cover = coversToBeZipped.pop();
    JSZipUtils.getBinaryContent(cover.file, function (err, data) {
        if(err) {
            console.error("A problem happened when download img: " + cover.file);

            return;
        }

        zip.file(cover.folder + '/' + COVER_IMAGE_NAME, data, {binary:true});
        
        if (coversToBeZipped.length === 0) {
            zip.generateAsync({type:'blob'}).then(function (blob) {
                saveAs(blob, ZIP_FILE_NAME);
                document.getElementById("wait").innerHTML = 'Done!';
            });

            return;
        } 
        
        addCoversToZipAndDownload(zip, coversToBeZipped);
    });
}

function processBinFile(file) {
    for (var i = 0; i < 1; i++) {
        var blob = file.slice(START_BYTE + (BULK_SIZE * i), START_BYTE + (BULK_SIZE * i) + BULK_SIZE);
        
        var reader = new FileReader();
        reader.readAsBinaryString(blob);
        reader.onload = function (evt) {
            var gameId = evt.target.result.match(PSX_ID_REGEX);
            var filePath = file.webkitRelativePath.split('/').slice(0, -1).pop();
            console.log(filePath);
            if (!gameId) {
                console.log('Game id not found for ' + filePath);
                document.getElementById("idNotFound").innerHTML += '<span class="errorGameId">Failed to extract game id for ' + filePath + '<pan><br/>';
                return;
            }

            addFileToFiles({
                name: file.name,
                type: BIN_EXTENSION,
                path: filePath,
                gameId: gameId[0].toLowerCase()
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

function prepareFolderCovers() {
    var folderCovers = [];

    for (var folder in filesInfo) {
        filesInfo[folder].forEach(function (file) {
            if (!covers.includes(file.gameId)) {
                console.log('image not found for ' + file.gameId + ' ' + file.name);
                document.getElementById("imageNotFound").innerHTML += '<span class="imageNotFound">image not found for ' + file.gameId + ' ' + file.name + '<pan><br/>';
                return;
            }

            folderCovers[file.path] = COVERS_PATH + '/' + file.gameId + '.' + BMP_EXTENSION;
        });
    }

    return folderCovers;
}