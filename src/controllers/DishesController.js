/// Knex, erro de aplicativo e importação de armazenamento em disco
const knex = require("../database/knex");
const AppError = require('../utils/AppError');
const DiskStorage = require("../providers/DiskStorage")

class DishesController {
    async create(request, response) {
        // Capturando Parâmetros Corporais
        const { title, description, category, price, ingredients } = request.body;

        // Verificando se o prato já existe no banco de dados
        const checkDishAlreadyExists = await knex("dishes").where({title}).first();
    
        if(checkDishAlreadyExists){
            throw new AppError("Este prato já existe no cardápio.")
        }

        // Solicitando nome do arquivo de imagem
        const imageFileName = request.file.filename;

        // Instanciando diskStorage
        const diskStorage = new DiskStorage()

        // Salvando arquivo de imagem
        const filename = await diskStorage.saveFile(imageFileName);

        // Inserindo as infos no banco de dados
        const dish_id = await knex("dishes").insert({
            image: filename,
            title,
            description,
            price,
            category,
        });

        // Verificando se o prato tem apenas um ingrediente e inserindo as informações no banco de dados
        const hasOnlyOneIngredient = typeof(ingredients) === "string";

        let ingredientsInsert

        if (hasOnlyOneIngredient) {
            ingredientsInsert = {
                name: ingredients,
                dish_id
            }

        } else if (ingredients.length > 1) {
            ingredientsInsert = ingredients.map(name => {
                return {
                    name,
                    dish_id
                }
            });
        }

        await knex("ingredients").insert(ingredientsInsert);

        return response.status(201).json(); 
    }

    async update(request, response) {
        // Capturando Parâmetros Corporais e Parâmetros ID
        const { title, description, category, price, ingredients, image } = request.body;
        const { id } = request.params;


        // Solicitando nome do arquivo de imagem
        const imageFileName = request.file.filename;
    
        // Instanciando diskStorage
        const diskStorage = new DiskStorage();

        // Obtendo os dados do prato através do ID informado
        const dish = await knex("dishes").where({ id }).first();
    
        // Excluindo a imagem antiga se uma nova imagem for carregada e salvando a nova imagem
        if (dish.image) {
          await diskStorage.deleteFile(dish.image);
        }
    
        const filename = await diskStorage.saveFile(imageFileName);
    
        // Verificações
        dish.image = image ?? filename;
        dish.title = title ?? dish.title;
        dish.description = description ?? dish.description;
        dish.category = category ?? dish.category;
        dish.price = price ?? dish.price;

        // Atualizando as informações do prato através do ID informado
        await knex("dishes").where({ id }).update(dish);
    
        // Verificando se o prato tem apenas um ingrediente e atualizando as informações no banco de dados
        const hasOnlyOneIngredient = typeof(ingredients) === "string";

        let ingredientsInsert

        if (hasOnlyOneIngredient) {
            ingredientsInsert = {
                name: ingredients,
                dish_id: dish.id,
            }
        
        } else if (ingredients.length > 1) {
            ingredientsInsert = ingredients.map(ingredient => {
                return {
                dish_id: dish.id,
                name : ingredient
                }
            });
        }
          
        await knex("ingredients").where({ dish_id: id}).delete()
        await knex("ingredients").where({ dish_id: id}).insert(ingredientsInsert)

        return response.status(201).json('Prato atualizado com sucesso')
    }

    async show(request, response) {
        
        // Capturando Parâmetros de ID
        const { id } = request.params;

        // Obtendo os dados do prato e ingredientes através do ID informado
        const dish = await knex("dishes").where({ id }).first();
        const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

        return response.status(201).json({
            ...dish,
            ingredients
        });
    }

    async delete(request, response) {
        
        // Capturando Parâmetros de ID
        const { id } = request.params;

        // Apagando prato através do ID informado
        await knex("dishes").where({ id }).delete();

        return response.status(202).json();
    }

    async index(request, response) {
        
        // Capturando parâmetros de consulta
        const { title, ingredients } = request.query;

        // Listando Pratos e Ingredientes ao mesmo tempo (innerJoin)
        let dishes;

        if (ingredients) {
            const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());
            
            dishes = await knex("ingredients")
                .select([
                    "dishes.id",
                    "dishes.title",
                    "dishes.description",
                    "dishes.category",
                    "dishes.price",
                    "dishes.image",
                ])
                .whereLike("dishes.title", `%${title}%`)
                .whereIn("name", filterIngredients)
                .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
                .groupBy("dishes.id")
                .orderBy("dishes.title")
        } else {
            dishes = await knex("dishes")
                .whereLike("title", `%${title}%`)
                .orderBy("title");
        }
            
        const dishesIngredients = await knex("ingredients") 
        const dishesWithIngredients = dishes.map(dish => {
            const dishIngredient = dishesIngredients.filter(ingredient => ingredient.dish_id === dish.id);
    
            return {
                ...dish,
                ingredients: dishIngredient
            }
        })
        
        return response.status(200).json(dishesWithIngredients);
    }

}

module.exports = DishesController;