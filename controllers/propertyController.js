import { validationResult } from "express-validator"
import { Price, Category, Property } from "../models/index.js"

export const admin = (req, res) => {
    res.render('properties/admin', {
        page: 'My Properties',
        header: true
    })
}

export const create = async (req, res) => {
    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render('properties/create', {
        page: 'Create Property',
        header: true,
        csrfToken: req.csrfToken(),
        categories,
        prices,
        data: {}
    })
}

export const save = async (req, res) => {
    let result = validationResult(req)

    if (!result.isEmpty()) {
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])

        return res.render('properties/create', {
            page: 'Create Property',
            header: true,
            csrfToken: req.csrfToken(),
            categories,
            prices,
            errors: result.array(),
            data: req.body
        })
    }

    const {
        title,
        description,
        category: categoryId,
        price: priceId,
        rooms,
        parking,
        bathrooms,
        street,
        lat,
        lng,
    } = req.body

    const { id: userId } = req.user

    try {
        const propertySaved = await Property.create({
            title,
            description,
            rooms,
            parking,
            bathrooms,
            street,
            lat,
            lng,
            userId,
            categoryId,
            priceId,
            image: ''
        })

        const { id } = propertySaved

        res.redirect(`/properties/addimg/${id}`)

    } catch (error) {
        console.log(error)
    }

}

export const remove = async (req, res) => {

}