import Price from '../models/Price.js'
import Category from '../models/Category.js'

export const admin = (req, res) => {
    res.render('properties/admin', {
        page: 'My Properties',
        header: true
    })
}

export const createForm = async (req, res) => {
    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render('properties/createForm', {
        page: 'Create Property',
        header: true,
        categories,
        prices
    })
}

export const remove = async (req, res) => {
    
}