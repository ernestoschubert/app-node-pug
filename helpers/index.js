export const isSeller = (userId, propertyUserId) => {
    return userId === propertyUserId;
}

export const formatDate = (date) => {
    const dateFormated = new Date(date).toISOString().slice(0, 10)

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }

    return new Date(dateFormated).toLocaleDateString('en-US', options)
}
