// Roteador, Multer e uploadConfig Import
const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('../configs/upload');

// Importação e inicialização dos controladores
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const DishesController = require("../controllers/DishesController")

const dishesController = new DishesController();

// Inicializando roteador e upload
const dishesRoutes = Router();
const upload = multer(uploadConfig.MULTER);

// Exigindo Autenticação
dishesRoutes.use(ensureAuthenticated);

// Pratos Rotas
dishesRoutes.post("/", upload.single("image"), dishesController.create);
dishesRoutes.get("/", dishesController.index);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.delete("/:id", dishesController.delete);
dishesRoutes.put("/:id", upload.single("image"), dishesController.update);

// Exportar
module.exports = dishesRoutes;