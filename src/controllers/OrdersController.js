// Knex Import
const knex = require("../database/knex");

class OrdersController {
    async create(request, response) {
        // Capturando Parâmetros Corporais e Parâmetros ID
        const { cart, orderStatus, totalPrice, paymentMethod } = request.body;
        const user_id = request.user.id;


        // Inserindo informações do pedido no banco de dados
        const order_id = await knex("orders").insert({
            orderStatus,
            totalPrice,
            paymentMethod,
            user_id
        });

        // Inserindo informações dos itens no banco de dados
        const itemsInsert = cart.map(cart => {
            return {
                title: cart.title,
                quantity: cart.quantity,
                dish_id: cart.id,
                order_id
            }
        });

        await knex("ordersItems").insert(itemsInsert);

        return response.status(201).json(order_id);
    }

    async index(request, response) {
        // Capturando o parâmetros ID
        const user_id = request.user.id;

        // Obtendo os dados do usuário através do ID informado
        const user = await knex("users").where({id: user_id}).first();

        // Listando Orders e OrdersItems ao mesmo tempo (innerJoin) para User
        if (!user.isAdmin) {

            const orders = await knex("ordersItems").where({ user_id })
                .select([
                    "orders.id",
                    "orders.user_id",
                    "orders.orderStatus",
                    "orders.totalPrice",
                    "orders.paymentMethod",
                    "orders.created_at",
                ])

                .innerJoin("orders", "orders.id", "ordersItems.order_id")
                .groupBy("orders.id")
            
            const ordersItems = await knex("ordersItems") 
            const ordersWithItems = orders.map(order => {
                const orderItem = ordersItems.filter(item => item.order_id === order.id);

                return {
                    ...order,
                    items: orderItem
                }
            })
            
            return response.status(200).json(ordersWithItems);

            // Listando Orders e OrdersItems ao mesmo tempo (innerJoin) para Admin
        } else {
            const orders = await knex("ordersItems")
                .select([
                    "orders.id",
                    "orders.user_id",
                    "orders.orderStatus",
                    "orders.totalPrice",
                    "orders.paymentMethod",
                    "orders.created_at",
                ])

                .innerJoin("orders", "orders.id", "ordersItems.order_id")
                .groupBy("orders.id")
        
            const ordersItems = await knex("ordersItems") 
            const ordersWithItems = orders.map(order => {
                const orderItem = ordersItems.filter(item => item.order_id === order.id);

                return {
                    ...order,
                    items: orderItem
                }
            })
        
            return response.status(200).json(ordersWithItems);
        }
    }

    async update(request, response) {
        // Capturando Parâmetros Corporais
        const { id, orderStatus } = request.body;
    
        
        // Atualizando informações do pedido através do ID informado
        await knex("orders").update({ orderStatus }).where({ id })
        
        return response.status(201).json();
    }
}

module.exports = OrdersController;