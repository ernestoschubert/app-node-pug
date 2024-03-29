import { Property, Price, Category } from "../models/index.js";

export const getProperties = async (req, res) => {

    const properties = await Property.findAll({
        include: [
            { model: Price, as: 'price' },
            { model: Category, as: 'category' }
        ]
    });

    res.json(properties);
}

