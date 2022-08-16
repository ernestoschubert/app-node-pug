import { exit } from 'node:process'
import categories from "./categories.js";
import Category from "../models/Category.js";
import prices from "./prices.js";
import Price from "../models/Price.js";
import db from '../config/db.js';

const importData = async () => {
    try {
        // authenticate
        await db.authenticate()

        // generate columns
        await db.sync()

        // insert data
        await Promise.all([
            Category.bulkCreate(categories),
            Price.bulkCreate(prices),
        ])

        console.log('import success ')
        exit() // () === (0) no errors

    } catch (error) {
        console.log(error)
        exit(1) // error
    }
}

const removeData = async () => {
    try {
        // await Promise.all([
        //     Category.destroy({ where: {}, truncate: true }),
        //     Price.destroy({ where: {}, truncate: true }),
        // ])
        // or
        await db.sync({ force: true })

        console.log('data removed successfully')
        exit()
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

if (process.argv[2] === "-i") {
    importData();
}

if (process.argv[2] === "-e") {
    removeData();
}
