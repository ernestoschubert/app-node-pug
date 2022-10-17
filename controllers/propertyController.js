import { validationResult } from "express-validator"
import { Price, Category, Property } from "../models/index.js"

export const admin = async (req, res) => {

    const { id } = req.user;

    console.log(id)

    const properties = await Property.findAll({
        where: {
            userId: id
        },
        include: [
            { model: Category, as: 'category' },
            { model: Price, as: 'price' },
        ]
    })

    res.render('properties/admin', {
        page: 'My Properties',
        properties
    })
}

export const create = async (req, res) => {
    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render('properties/create', {
        page: 'Create Property',
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

export const addImg = async (req, res) => {

    const { id } = req.params

    // validate property exist

    const property = await Property.findByPk(id)

    if (!property) {
        return res.redirect("/myproperties")
    }

    // validate property isn't published

    if (property.published) {
        return res.redirect("/myproperties")
    }

    // validate if user is owner of this property
    if (property.userId.toString() !== req.user.id.toString()) {
        return res.redirect("/myproperties")
    }

    res.render('properties/addimg', {
        page: `Add images to ${property.title}`,
        property,
        csrfToken: req.csrfToken(),
    })
}

export const storageImg = async (req, res, next) => {

    const { id } = req.params

    // validate property exist

    const property = await Property.findByPk(id)

    if (!property) {
        return res.redirect("/myproperties")
    }

    // validate property isn't published

    if (property.published) {
        return res.redirect("/myproperties")
    }

    // validate if user is owner of this property
    if (property.userId.toString() !== req.user.id.toString()) {
        return res.redirect("/myproperties")
    }

    try {
        console.log(req.file)
        // storage the img and publicate property
        property.image = req.file.filename;
        property.published = 1;

        await property.save();
        next()
    } catch (error) {
        console.log(error)
    }

}

export const remove = async (req, res) => {

}