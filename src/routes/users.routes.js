// Roteador, Multer e uploadConfig Import
const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('../configs/upload');

// Importação e inicialização dos controladores
const UsersController = require("../controllers/UsersController")
const UserAvatarController = require("../controllers/UserAvatarController");

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

// Importação de middleware
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

// Inicializando roteador e upload
const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

// Rotas dos usuários
usersRoutes.post("/",usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update);

// Exportar
module.exports = usersRoutes;