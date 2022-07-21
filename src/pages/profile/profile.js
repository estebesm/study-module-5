import '../../styles/style.scss'
import '../../styles/components.scss'
import './profile.scss'
import {getToken} from "../../functions/localstorage";
import {deleteBook, editBook, getBook, setFavorite} from "../../functions/api";

const bookNameElem = document.getElementById('book__name')
const bookAuthorElem = document.getElementById('book__author')
const bookPublishHouseElem = document.getElementById('book__publishHouse')
const bookPublishYearElem = document.getElementById('book__publishYear')
const bookPagesNumberElem = document.getElementById('book__pagesNumber')
const bookGenresElem = document.getElementById('book__genres')
const bookLanguageElem = document.getElementById('book__originalLanguage')
const bookFavoriteButton = document.getElementById('book__favoriteButton')
const bookDeleteButton = document.getElementById('book__deleteButton')

const bookProfileElement = {
    name: bookNameElem,
    author: bookAuthorElem,
    publishHouse: bookPublishHouseElem,
    publishYear: bookPublishYearElem,
    pagesNumber: bookPagesNumberElem,
    originalLanguage: bookLanguageElem,
    genres: bookGenresElem
}

const editBookForm = document.getElementById('edit-book')

const requiredInputs = document.querySelectorAll('.required')

const openModalButton = document.querySelector('.edit-button')
const closeModalButton = document.querySelector('#edit-book__modal .close-button')
const editBookModal = document.getElementById('edit-book__modal')


if(!getToken()){
    window.location.href = '/auth.html'
}

const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
    }
)

const bookId = params.id

getBook(bookId)
    .then(res => {
        for(let prop in bookProfileElement){
            if(prop === 'genres'){
                bookProfileElement[prop].textContent = res[prop].join(' ,') || 'пусто'
                editBookForm.elements[prop].value = res[prop].join(' ,')
            }
            bookProfileElement[prop].textContent = res[prop] || 'пусто'
            editBookForm.elements[prop].value = res[prop]
        }

        if(res.isFavorite){
            bookFavoriteButton.classList.add('active')
        } else{
            bookFavoriteButton.classList.remove('active')
        }
    })

bookFavoriteButton.addEventListener('click', () => {
    if(bookFavoriteButton.classList.contains('active')){
        bookFavoriteButton.classList.remove('active')
        setFavorite(bookId, false)
            .catch(() => {
                bookFavoriteButton.classList.add('active')
            })
    } else {
        bookFavoriteButton.classList.add('active')
        setFavorite(bookId, true)
            .catch(() => {
                bookFavoriteButton.classList.remove('active')
            })
    }
})

bookDeleteButton.addEventListener('click', () => {
    window.location.href = '/'
    deleteBook(bookId)

        .catch(() => {

        })
})

function validateEditBookForm(submitEvent){
    submitEvent.preventDefault()

    requiredInputs.forEach(input => {
        if (input.value.length === 0) {
            input.classList.add('error')
            input.parentElement.classList.add('error')
        } else {
            input.classList.remove('error')
            input.parentElement.classList.remove('error')
        }
    })


    requiredInputs.forEach(input => {
        input.addEventListener('input', (inputEvent) => {
            if (inputEvent.target.value.length === 0) {
                input.classList.add('error')
                input.parentElement.classList.add('error')
            } else {
                input.classList.remove('error')
                input.parentElement.classList.remove('error')
            }
        })
    })

    let error = false
    requiredInputs.forEach(input => {
        if(input.classList.contains('error')){
            error = true
        }
    })
    if(!error){
        const data = Object.fromEntries(new FormData(submitEvent.target).entries())
        editBook(bookId, data)
            .then(res => {
                if(res.id){
                    document.location.reload()
                }
            })
    }
}

editBookForm.addEventListener('submit', validateEditBookForm)
openModalButton.addEventListener('click', () => {
    editBookModal.classList.add('active')
})
closeModalButton.addEventListener('click', () => {
    editBookModal.classList.remove('active')
})