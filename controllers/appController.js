import { Price, Category, Property } from '../models/index.js'

export const init = async (req, res) => {

    const [categories, prices, houses, apartments] = await Promise.all([
        Category.findAll({ raw: true }),
        Price.findAll({ raw: true }),
        Property.findAll({
            limit: 3,
            where: {
                categoryId: 1,
            },
            include: [
                {
                    model: Price, as: 'price'
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        Property.findAll({
            limit: 3,
            where: {
                categoryId: 2,
            },
            include: [
                {
                    model: Price, as: 'price'
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),
    ])

    res.render('home', {
        page: "Home",
        categories,
        prices,
        houses,
        apartments,
    })
}

export const category = async (req, res) => {

}


export const notFound = async (req, res) => {

}

export const searcher = async (req, res) => {

}
