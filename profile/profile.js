"use script"


window.onload = function () {
    const showUsername = document.querySelector("#username")
    let username = getLoginData().username
    showUsername.innerHTML = username
    showUserPosts()

    const logoutButton = document.querySelector("#logout")
    logoutButton.onclick = runLogOut

    const postButton = document.getElementById("post")
    postButton.onclick = postMessage

    const editButton = document.querySelector("#edit")
    editButton.onclick = editAccount
}

function postMessage() {
    const form = document.querySelector("#newPostForm")
    let html = `
            <input type="text" name="" placeholder="Add Text" id="text">
            <button type="submit" id="submitButton">Make Post</button>
        `
    form.innerHTML = html
    console.dir(form)
    form.onsubmit = getNewPost
}

function editAccount() {
    const editAccount = document.querySelector("#editAccountForm")
    let html = `
    <input type="text" name="" placeholder="Edit Password" id="newPass">
    <input type="text" name="" placeholder="Edit Bio" id="newBio">
    <input type="text" name="" placeholder="Edit Full Name" id="newName">
    <button type="submit" id="submitButton">Confirm Changes</button>
    `
    editAccount.innerHTML = html
    editAccount.onsubmit = editUserData
}

function getNewPost(event) {
    event.preventDefault()
    let newPost = {
        text: event.target.elements.text.value
    }
    return postRequest(newPost)
}

function postRequest(json) {
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLoginData().token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
    }
    fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts', options)
        .then(response => response.json())
        .then(data => console.log(data, successMessage()))
}

function successMessage() {
    return alert("Post successfully made!")
}

function editUserData(event) {
    event.preventDefault()
    const editAccount = event.target.elements
    let newPassword = editAccount.newPass.value
    let newBio = editAccount.newBio.value
    let newName = editAccount.newName.value
    let editJSON = {}

    if (newPassword.length > 0) {
        editJSON.password = newPassword
    }
    if (newBio.length > 0) {
        editJSON.bio = newBio
    }
    if (newName.length > 0) {
        editJSON.fullName = newName
    }

    return putRequest(editJSON)
}

function putRequest(editJSON) {
    const options = {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getLoginData().token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(editJSON)
    }
    fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/users/${getLoginData().username}`, options)
        .then(response => response.json())
        .then(data => console.log(data, successEditMessage()))
}

function successEditMessage() {
    return alert("Account Edit Successfully Made!")
}

function runLogOut() {
    console.log("LOG ME OUT")
    if (window.confirm('Are you sure you want to logout? If so, hit "ok"! If not, hit "cancel"')) {
        logout()
    }
}

function showUserPosts() {
    const options = {
        headers: {
            'Authorization': `Bearer ${getLoginData().token}`
        }
    }
    fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts", options)
        .then(response => response.json())
        .then(data => getAllPosts(data))
}

function getAllPosts(posts) {
    let html = ""
    for (const post of posts) {
        if (post.username === getLoginData().username) {
            html += showPosts(post)
        }
    }

    const profileDiv = document.querySelector("#profileDiv")
    profileDiv.innerHTML = html

    const deleteButton = document.getElementById("deleteButton")
    deleteButton.onclick = deletePostConfirm
}

function showPosts(post) {
    return `
   <body class="center-content">
               <div class="card w-50">
                
                    <div class="card-header">
                        ${post.username}
                        <button id="deleteButton" value="${post._id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                        Delete Post </button>
                    </div>
                
               <div class="card-body">
                 <blockquote class="blockquote mb-0">
                   <p>${post.text}</p>
                   <footer class="blockquote-footer">${formatDate(post.createdAt)}</footer>
                   <p>${post.likes.length}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
              </svg>
              </p>
                 </blockquote>
               </div>
             </div>
           `
}

function formatDate(timestamp) {
    const date = new Date(timestamp)
    const formatOptions = {
        dateStyle: 'medium',
        timeStyle: 'short'
    }
    return new Intl.DateTimeFormat(undefined, formatOptions).format(date)
}

function deletePostConfirm(event) {
    const postId = event.target.value
    if (window.confirm('Are you sure you want to delete this post? Hit "ok" to delete post. Hit "cancel" if you change your mind!')) {
        deletePost(postId)
    }
}

function deletePost(postId) {
    const options = {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getLoginData().token}`,
            "Content-Type": "application/json"
        }
    }
    fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts/${postId}`, options)
        .then(response => response.json())
        .then(data => console.log(data, successDeleteMessage()))
}

function successDeleteMessage() {
    return alert("Post successfully deleted!")
}

//load form unpon button click/submit? or GO TO NEW PAGE to make new post?/??
//get all information of post from form
//do POST REQUEST to post api endpoint
//mayve show messager that says "post made :D"

//show all posts on profile page
//GET all posts for speciifcal user
//find user by looking in local storage
//use posts{username} endpoint
