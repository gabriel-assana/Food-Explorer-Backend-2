// Importação do roteador
const { Router } = require('express');

// Importação de Rotas
const usersRouter = require("./users.routes");
const dishesRouter = require("./dishes.routes");
const ordersRouter = require("./orders.routes");
const sessionsRouter = require("./sessions.routes");

// Inicializando roteador
const routes = Router();

// Rotas de Aplicação
routes.use("/users", usersRouter);
routes.use("/dishes", dishesRouter);
routes.use("/orders", ordersRouter);
routes.use("/sessions", sessionsRouter);

// Exportar
module.exports = routes;