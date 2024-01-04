
/* Posts Page JavaScript */

"use strict";

window.onload = function () {
    getPostsData()
        .then(loopData)

    const filterSelect = document.querySelector("#select")
    filterSelect.onchange = () => getPostsData().then(filterPosts)

    const postLogout = document.querySelector("#postLogout")
    postLogout.onclick = showLogoutMessage
}

function getPostsData() {
    const options = {
        headers: {
            'Authorization': `Bearer ${getLoginData().token}`
        }
    }
    return fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts', options)
        .then(response => response.json())
    // .then(data => loopData(data))
    // .catch(error => console.log(error))
}

function loopData(posts) {
    let html = ""
    for (let index = 0; index < posts.length; index += 1) {
        const post = posts[index];
        html += makePost(post)
    }
    const postDiv = document.querySelector("#posts")
    postDiv.innerHTML = html
}

function filterPosts(posts) {
    const filterSelect = document.querySelector("#select")
    const filter = filterSelect.value
    const mostLikes = filter === "mostLikes"

    let preferredSortMethod = compareDown
    if (mostLikes === false) {
        preferredSortMethod = compareUp
    }
    
    loopData(posts.sort(preferredSortMethod))
}

function compareUp(a, b) {
    return a.likes.length - b.likes.length
}

function compareDown(a, b) {
    return b.likes.length - a.likes.length
}

function makePost(post) {
    return `
    <body class="center-content">
    <div class="card w-50">
    <div class="card-header">
      ${post.username}
    </div>
    <div class="card-body">
      <blockquote class="blockquote mb-0">
        <p>${post.text}</p>
        <footer class="blockquote-footer">${formatDate(post.createdAt)}</footer>
        <p>${post.likes.length} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
            <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
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

function showLogoutMessage() {
    console.log("LOG OUT")
    if (window.confirm('Are you sure you want to log out? Hit "ok" to logout! Hit "cancel" to stay logged in!')) {
        return logout()
    }
}
//const somethign = query selector something
//somethign innerhtml = html


// DISPLAY ALL POSTS
//make GET REQUEST to post api endpoint
//make  a loop
//make card for each post

