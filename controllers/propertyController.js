
export const admin = (req, res) => {
    res.render('properties/admin', {
        page: 'My Properties',
        header: true
    })
}

export const createForm = (req, res) => {
    res.render('properties/createForm', {
        page: 'Create Property',
        header: true
    })
}

export const remove = async (req, res) => {
    
}