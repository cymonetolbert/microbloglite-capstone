"use strict"

const signUpForm = document.querySelector("#signUpForm")
signUpForm.onsubmit = getData

function getData (event) {
    event.preventDefault()
    const form = event.target.elements

    if (form.password.value !== form.confirmPassword.value) {
        alert("Please make sure your password and confirm password match! :D")
    }

    const newUserJSON = ({
        username: form.username.value,
        fullName: form.fullName.value,
        password: form.password.value
    })
    return addUser (newUserJSON)
}

function addUser (json) {
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
    }
    fetch ('http://microbloglite.us-east-2.elasticbeanstalk.com/api/users', options)
    .then (response => response.json())
    .then (newUser => console.log(newUser))
}

