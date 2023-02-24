// FS, Path and UploadConfig Import
const fs = require('fs');
const path = require('path');
const uploadConfig = require('../configs/upload');

class DiskStorage {
    async saveFile(file){
        await fs.promises.rename(
            
            // arquivo de posição inicial
            path.resolve(uploadConfig.TMP_FOLDER, file),
            // arquivo de posição final
            path.resolve(uploadConfig.UPLOADS_FOLDER, file)
        );

        return file;
    }

    async deleteFile(file){
        // Obtendo o endereço do arquivo
        const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

        try {
            
            // Se existir
            await fs.promises.stat(filePath);
        } catch {
            // Parando
            return;
        }

        // Apagando
        await fs.promises.unlink(filePath);
    }
}

module.exports = DiskStorage;
