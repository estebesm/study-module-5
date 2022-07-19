import {getToken, removeToken} from "./localstorage";

const API_URL = 'http://localhost:1717'

export const signIn = async (data) => {
    const res = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return await res.json()
}

export const login = async (data) => {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return await res.json()
}

export const logout = () => {
    removeToken()
    window.location.href = '/auth.html'
}

export const getBooks = async () => {
    const res = await fetch(`${API_URL}/books`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth': getToken()
        }
    })
    return await res.json()
}

export const getBook = async (id) => {
    const res = await fetch(`${API_URL}/books/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth': getToken()
        }
    })
    return await res.json()
}

export const setFavorite = async (id, isFavorite) => {
    const res = await fetch(`${API_URL}/books/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth': getToken()
        },
        body: JSON.stringify({isFavorite})
    })
    return await res.json()
}

export const createBook = async (data) => {
    const formattedData = {
        ...data,
        genres: data.genres.split(/[, ]+/),
        pagesNumber: +data.pagesNumber,
        publishYear: +data.publishYear
    }
    const res = await fetch(`${API_URL}/books/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth': getToken()
        },
        body: JSON.stringify(formattedData)
    })
    return await res.json()
}

export const deleteBook = async (id) => {
    const res = await fetch(`${API_URL}/books/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth': getToken()
        },
    })
    return await res.json()
}

export const editBook = async (id, data) => {
    const formattedData = {
        ...data,
        genres: data.genres.split(/[, ]+/),
        pagesNumber: +data.pagesNumber,
        publishYear: +data.publishYear
    }
    const res = await fetch(`${API_URL}/books/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth': getToken()
        },
        body: JSON.stringify(formattedData)
    })
    return await res.json()
}