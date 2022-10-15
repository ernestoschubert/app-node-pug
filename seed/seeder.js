import { exit } from "node:process"
import categories from "./categories.js";
import prices from "./prices.js";
import users from "./users.js";
import db from "../config/db.js";
import { User, Price, Category } from "../models/index.js"


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
            User.bulkCreate(users),
        ])

        console.log("import success")
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

        console.log("data removed successfully")
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
