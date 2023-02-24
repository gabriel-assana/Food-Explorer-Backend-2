// Importação do roteador
const { Router } = require('express');

// Importação e inicialização dos controladores
const OrdersController = require("../controllers/OrdersController")

const ordersController = new OrdersController();

// Importação de middleware
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const ensureUserIsAdmin = require("../middlewares/ensureUserIsAdmin");

// Inicializando roteador
const ordersRoutes = Router();

// Exigindo Autenticação
ordersRoutes.use(ensureAuthenticated);

// Rotas de Ordens
ordersRoutes.post("/", ordersController.create);
ordersRoutes.get("/", ordersController.index);
ordersRoutes.put("/", ensureUserIsAdmin, ordersController.update);

// Exportar
module.exports = ordersRoutes;