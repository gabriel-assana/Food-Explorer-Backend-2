// Router Import
const { Router } = require('express');

// Importação e inicialização dos controladores
const SessionsController = require("../controllers/SessionsController");
const sessionsController = new SessionsController();

// Inicializando roteador
const sessionsRoutes = Router();

// Rotas de Sessões
sessionsRoutes.post("/", sessionsController.create);

// Exportar
module.exports = sessionsRoutes;