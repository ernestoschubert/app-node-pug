import { unlink } from "node:fs/promises"
import { validationResult } from "express-validator"
import { Price, Category, Property } from "../models/index.js"

export const admin = async (req, res) => {

    const { id } = req.user;

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
        csrfToken: req.csrfToken(),
        properties,
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
        // storage the img and publicate property
        property.image = req.file.filename;
        property.published = 1;

        await property.save();
        next()
    } catch (error) {
        console.log(error)
    }

}

export const edit = async (req, res) => {
    const { id } = req.params

    // validate if property exists
    const property = await Property.findByPk(id)

    if (!property) res.redirect('/myproperties')

    // verify if user is the owner of the property

    if (property.userId.toString() !== req.user.id.toString()) res.redirect('/myproperties')

    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll(),
    ])

    res.render('properties/edit', {
        page: `Edit Property: ${property.title}`,
        csrfToken: req.csrfToken(),
        categories,
        prices,
        data: property
    })
}

export const saveChanges = async (req, res) => {
    // Validate form
    let result = validationResult(req)

    if (!result.isEmpty()) {
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])

        return res.render('properties/edit', {
            page: `Edit Property: ${req.body.title}`,
            csrfToken: req.csrfToken(),
            categories,
            prices,
            errors: result.array(),
            data: req.body
        })
    }

    // validate if property exists

    const { id } = req.params
    const property = await Property.findByPk(id)

    if (!property) res.redirect('/myproperties')

    // verify if user is the owner of the property

    if (property.userId.toString() !== req.user.id.toString()) res.redirect('/myproperties')

    // rewrite object and update

    try {
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

        property.set({
            title,
            description,
            categoryId,
            priceId,
            rooms,
            parking,
            bathrooms,
            street,
            lat,
            lng,
        })

        await property.save();
    } catch (error) {
        console.log(error)
    }

}

export const remove = async (req, res) => {

    // validate if property exists
    const { id } = req.params

    const property = await Property.findByPk(id)

    if (!property) res.redirect('/myproperties')

    // verify if user is the owner of the property

    if (property.userId.toString() !== req.user.id.toString()) res.redirect('/myproperties')

    // delete property images
    if (property.image) await unlink(`public/uploads/${property.image}`)

    // delete property
    await property.destroy();
    return res.redirect('/myproperties')

}

export const viewProperty = async (req, res) => {

    const { id } = req.params

    // verify property exists
    const property = await Property.findByPk(id, {
        include: [
            { model: Category, as: 'category' },
            { model: Price, as: 'price' },
        ]
    })

    if (!property) res.redirect('/404')

    return res.render('properties/view', {
        page: property.title,
        data: property
    })

}
