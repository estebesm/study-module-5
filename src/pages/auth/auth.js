import '../../styles/style.scss'
import './auth.scss'
import {login, signIn} from "../../functions/api";
import {setToken} from "../../functions/localstorage";

const singInSwitchButton = document.getElementById("auth__switch-button__sign-in")
const loginSwitchButton = document.getElementById("auth__switch-button__login")

const signInForm = document.getElementById('sign-in')
const loginForm = document.getElementById('login')

const usernameInput = document.getElementById('sign-in__username')
const passwordInput = document.getElementById('sign-in__password')
const repeatedPasswordInput = document.getElementById('sign-in__repeated-password')
const ageInput = document.getElementById('sign-in__age')

const invalidChars = [
    "-",
    "+",
    "e",
];

ageInput.addEventListener("keydown", function(e) {
    if (invalidChars.includes(e.key)) {
        e.preventDefault();
    }
});

singInSwitchButton.addEventListener('click', () => {
    loginForm.classList.remove('active')
    signInForm.classList.add('active')
    loginSwitchButton.classList.remove('active')
    singInSwitchButton.classList.add('active')
})

loginSwitchButton.addEventListener('click', () => {
    signInForm.classList.remove('active')
    loginForm.classList.add('active')
    singInSwitchButton.classList.remove('active')
    loginSwitchButton.classList.add('active')
})

signInForm.addEventListener('submit', (e) => {
    e.preventDefault()
    validateSignInForm(e)
})

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    validateLoginForm(e)
})

function validateLoginForm(e){
    const inputs = document.querySelectorAll('#login input')
    const data = Object.fromEntries(new FormData(e.target).entries())
    const submitButton = document.querySelector('#login .submit')

    submitButton.disabled = true
    login(data)
        .then(res => {
            if(res.token){
                setToken(res.token)
                window.location.href = '/'
            }
            else {
                inputs.forEach(input => {
                    input.classList.add('error')
                    loginForm.classList.add('error')
                    input.addEventListener('input', () => {
                        inputs.forEach(elem => {
                            if(elem.value.length > 0) {
                                elem.classList.remove('error')
                                loginForm.classList.remove('error')
                            }
                        })
                        if(input.value.length === 0){
                            input.classList.add('error')
                            loginForm.classList.add('error')
                        }
                    })
                })
            }
        })
        .finally(() => {
            submitButton.disabled = false
        })

}

function validateSignInForm(e){
    const submitButton = document.querySelector('#sign-in .submit')

    usernameInput.addEventListener('input', validateRequiredInput)
    passwordInput.addEventListener('input', validatePassword)
    repeatedPasswordInput.addEventListener('input', validatePassword)
    validateRequiredInput()
    validatePassword()
    const inputs = [usernameInput, passwordInput, repeatedPasswordInput]
    let error = false
    inputs.forEach(input => {
        if(input.classList.contains('error')){
            error = true
        }
    })
    if(!error){
        const data = Object.fromEntries(new FormData(e.target).entries())
        submitButton.disabled = true
        signIn(data)
            .then(res => {
                if(res.token){
                    setToken(res.token)
                    window.location.href = '/'
                }
            })
            .finally(() => {
                submitButton.disabled = false
            })
    }
}

function validateRequiredInput(){
    const inputs = [usernameInput, passwordInput, repeatedPasswordInput]

    inputs.forEach(input => {
        if(input.value.length === 0){
            input.classList.add('error')
            input.parentElement.classList.add('error')
        } else {
            input.classList.remove('error')
            input.parentElement.classList.remove('error')
        }
    })
}

function validatePassword(){
    validateRequiredInput()
    if(passwordInput.value === repeatedPasswordInput.value && passwordInput.value.length > 0){
        passwordInput.classList.remove('error')
        repeatedPasswordInput.classList.remove('error')
        repeatedPasswordInput.parentElement.classList.remove('repeat-error')
    }
    else{
        passwordInput.classList.add('error')
        repeatedPasswordInput.classList.add('error')
        if(passwordInput.value !== repeatedPasswordInput.value) {
            repeatedPasswordInput.parentElement.classList.add('repeat-error')
        } else {
            repeatedPasswordInput.parentElement.classList.remove('repeat-error')
        }
    }
}