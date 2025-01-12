export const getFromLS = (key) => {
    return localStorage.getItem(key)
}

export const getParsedItemFromLS = (key) => {
    const item = getFromLS(key);
    return JSON.parse(item)
}

export const setToLS = (key, value) => {
    try {
        const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, valueToStore);
    } catch (error) {
        console.error(error)
    }
}

