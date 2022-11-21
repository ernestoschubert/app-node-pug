import { Price, Category, Property } from '../models/index.js'
import { Sequelize } from 'sequelize'

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
        csrfToken: req.csrfToken()
    })
}

export const category = async (req, res) => {
    const { id } = req.params

    // VERIFY CATEGORY EXITS
    const category = await Category.findByPk(id)
    if (!category) res.redirect('/404')

    // GET PROPERTIES BY CATEGORY
    const properties = await Property.findAll({
        where: {
            categoryId: id
        },
        include: [
            { model: Price, as: 'price' }
        ],
    })

    res.render('category', {
        page: `${category?.name}s on Sale`,
        properties,
        csrfToken: req.csrfToken()
    })

}

export const notFound = async (req, res) => {
    res.render('404', {
        page: 'Not Found',
        csrfToken: req.csrfToken(),
    })

}

export const searcher = async (req, res) => {
    const { search } = req.body
    // validate search isnt empty
    if (!search.trim()) return res.redirect('back')

    const properties = await Property.findAll({
        where: {
            title: {
                [Sequelize.Op.like]: '%' + search + '%'
            }
        },
        include: [
            { model: Price, as: 'price' }
        ]
    })

    res.render('search', {
        page: 'Search results',
        properties,
        csrfToken: req.csrfToken(),
    })
}
