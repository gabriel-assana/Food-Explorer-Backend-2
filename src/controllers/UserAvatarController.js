// Knex, App Error and Disk Storage Import
const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class UserAvatarController {
    async update(request, response) {
        // Capturando parâmetros de ID e nome do arquivo de imagem
        const user_id = request.user.id;
        const avatarFilename = request.file.filename;

        // Instanciando diskStorage
        const diskStorage = new DiskStorage();

        // Obtendo os dados do usuário através do ID informado
        const user = await knex("users")
            .where({ id: user_id }).first();

            // Verificações
            if (!user) {
                throw new AppError("Somente usuários autenticados podem mudar o avatar", 401)
            }

            // Excluindo a imagem antiga se uma nova imagem for carregada e salvando a nova imagem
            if (user.avatar) {
                await diskStorage.deleteFile(user.avatar);
            }

            const filename = await diskStorage.saveFile(avatarFilename);
            user.avatar = filename;

            await knex("users").update(user).where({ id: user_id });

            return response.status(201).json(user);
    }
}

module.exports = UserAvatarController;