// AppError and Knex Import
const knex = require('../database/knex');
const AppError = require('../utils/AppError');

async function ensureUserIsAdmin(request, response, next) {
    
    // Capturando Parâmetros de ID
    const user_id = request.user.id;

    
    // Obtendo os dados do usuário através do ID informado
    const user = await knex("users").where({id: user_id}).first();

    // Verifica se o usuário é Admin
    if (!user.isAdmin) {
        throw new AppError("Access Denied: Unauthorized User", 401)
    }

    next();
}

module.exports = ensureUserIsAdmin;