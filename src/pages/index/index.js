import '../../styles/style.scss'
import '../../styles/components.scss'
import './index.scss'
import {getToken} from "../../functions/localstorage";
import {createBook, deleteBook, getBooks, logout, setFavorite} from "../../functions/api";

const modal = document.getElementById('main__add-book__modal')
const closeModalButton = document.getElementById('main__add-book__modal__close')
const openModalButton = document.getElementById('main__add-book__modal__open')
const logoutButton = document.getElementById('main__logout')

const bookList = document.getElementById('main__book-list')

const addBookForm = document.getElementById('add-book')

const requiredInputs = document.querySelectorAll('.required')

closeModalButton.addEventListener('click', closeModal)
openModalButton.addEventListener('click', openModal)
logoutButton.addEventListener('click', logout)

if(!getToken()){
    window.location.href = '/auth.html'
}


function openModal(){
    document.body.style.overflow = 'hidden'
    modal.classList.add('active')
}

function closeModal(){
    document.body.style.overflow = 'visible'
    modal.classList.remove('active')
}


getBooks()
    .then(res => {
        let list = ''
        res.forEach((book) => {
            list += `
                <li class="list__item">
                    <a href="/profile.html?id=${book.id}">
                        <div class="book__info">
                            <div class="title">
                                ${book.name}
                            </div>
                            <div class="author">
                                ${book.author}
                            </div>
                        </div>
                        <div class="book__actions" id=${book.id}>
                            <button type="button" class="favorite ${book.isFavorite && 'active'}">
                                <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.3762 2.5401C18.5386 0.825205 16.1258 -0.577889 13.3191 0.239024C11.9779 0.625491 10.8078 1.45428 9.99986 2.58999C9.19192 1.45428 8.02178 0.625491 6.68062 0.239024C3.86771 -0.565417 1.46111 0.825205 0.623483 2.5401C-0.55169 4.94095 -0.0641182 7.64113 2.0737 10.5658C3.74894 12.8544 6.14304 15.1742 9.61856 17.8681C9.72839 17.9536 9.86369 18 10.003 18C10.1423 18 10.2776 17.9536 10.3874 17.8681C13.8567 15.1804 16.257 12.8793 17.9323 10.5658C20.0638 7.64113 20.5514 4.94095 19.3762 2.5401Z" fill="#B1B1B1"/>
                                </svg>
                            </button>
                            <button type="button" class="delete">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.1667 3.6H15.8333V1.6C15.8333 0.7175 15.0859 0 14.1667 0H5.83333C4.91406 0 4.16667 0.7175 4.16667 1.6V3.6H0.833333C0.372396 3.6 0 3.9575 0 4.4V5.2C0 5.31 0.09375 5.4 0.208333 5.4H1.78125L2.42448 18.475C2.46615 19.3275 3.20052 20 4.08854 20H15.9115C16.8021 20 17.5339 19.33 17.5755 18.475L18.2187 5.4H19.7917C19.9062 5.4 20 5.31 20 5.2V4.4C20 3.9575 19.6276 3.6 19.1667 3.6ZM13.9583 3.6H6.04167V1.8H13.9583V3.6Z" fill="#B1B1B1"/>
                                </svg>
                            </button>
                        </div>
                    </a>
                </li>
            `
            bookList.innerHTML = list
        })
        const bookFavoriteButtons = document.querySelectorAll('button.favorite')
        bookFavoriteButtons.forEach(button => button.addEventListener('click', (e) => {
            e.preventDefault()
            const bookId = button.parentElement.id
            if(button.classList.contains('active')){
                button.classList.remove('active')
                setFavorite(bookId, false)
                    .catch(() => {
                        button.classList.add('active')
                    })
            } else {
                button.classList.add('active')
                setFavorite(bookId, true)
                    .catch(() => {
                        button.classList.remove('active')
                    })
            }
        }))

        const bookDeleteButtons = document.querySelectorAll('button.delete')
        bookDeleteButtons.forEach(button => button.addEventListener('click', (e) => {
            e.preventDefault()
            const bookId = button.parentElement.id
            button.closest('li').style.display = 'none'
            deleteBook(bookId)
                .then(() => {
                    button.closest('li').remove()
                })
                .catch(() => {
                    button.closest('li').style.display = 'block'
                })
        }))
    })


function validateAddBookForm(submitEvent){
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
        createBook(data)
            .then(res => {
                if(res.id){
                    window.location.href = '/'
                }
            })
    }
}

addBookForm.addEventListener('submit', validateAddBookForm)


