import bcrypt from "bcrypt"

const users = [
    {
        firstName: "Ernesto",
        lastName: "Schubert",
        email: "ernestoschubert23@gmail.com",
        password: bcrypt.hashSync('password', 10),
        confirmed: 1,
    }
]

export default users