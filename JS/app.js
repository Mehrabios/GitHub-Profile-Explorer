let errorMessageTextElement = document.querySelector(".error-message-text");
let mainElement = document.querySelector("main");
let userLinkElement = document.querySelector(".user-link");
let userImageElement = document.querySelector(".user-img");
let nameElement = document.querySelector(".name-text");
let usernameElement = document.querySelector(".username-text");
let bioElement = document.querySelector(".bio-text");
let blogLinkElement = document.querySelector(".blog-link");
let twitterLinkElement = document.querySelector(".twitter-link");
let locSvgElement = document.querySelector(".loc-svg");
let locTextElement = document.querySelector(".loc-text");
let blogSvgElement = document.querySelector(".blog-svg");
let blogTextElement = document.querySelector(".blog-text");
let twitterSvgElement = document.querySelector(".twitter-svg");
let twitterTextElement = document.querySelector(".twitter-text");
let totalStarsTextElement = document.querySelector(".total-stars-text");
let totalForksTextElement = document.querySelector(".total-forks-text");
let totalWatchersTextElement = document.querySelector(".total-watchers-text");

let errorMessageElement = document.querySelector(".error-message");
let usernameInputElement = document.querySelector(".username-input");

function usernameFounder(event){
    event.preventDefault();

    let username = usernameInputElement.value;
    let usernameUrl = `https://api.github.com/users/${username}`;
    let reposUrl = `https://api.github.com/users/${username}/repos`;

    axios.get(usernameUrl)
        .then(function(response){
            errorMessageTextElement.textContent = "";
            mainElement.classList.replace("d-none", "d-flex");
            userLinkElement.setAttribute("href", response.data.html_url);
            userImageElement.setAttribute("src", response.data.avatar_url);
            userImageElement.setAttribute("alt", response.data.name);
            userImageElement.setAttribute("title", response.data.name);
            nameElement.textContent = response.data.name;
            usernameElement.textContent = response.data.login;
            bioElement.textContent = response.data.bio;

            if (response.data.location == null){
                locSvgElement.classList.remove("d-block");
                locSvgElement.classList.add("d-none");
                locTextElement.textContent = "";
            }
            else {
                locSvgElement.classList.replace("d-none", "d-block");
                locTextElement.textContent = " " + response.data.location;
            }
            if (response.data.blog == null || response.data.blog == "") {
                blogSvgElement.classList.remove("d-block");
                blogSvgElement.classList.add("d-none");
                blogTextElement.textContent = "";
            }
            else {
                blogSvgElement.classList.replace("d-none", "d-block");
                blogTextElement.textContent = " " + response.data.blog;
                blogLinkElement.setAttribute("href", `https://${response.data.blog}`);
            }
            if (response.data.twitter_username == null){
                twitterSvgElement.classList.remove("d-block");
                twitterSvgElement.classList.add("d-none");
                twitterTextElement.textContent = "";
            }
            else {
                twitterSvgElement.classList.replace("d-none", "d-block");
                twitterTextElement.textContent = " " + "@" + response.data.twitter_username;
                twitterLinkElement.setAttribute("href", `https://twitter.com/${response.data.twitter_username}`);
            }
        })
        .catch(function(error) {
            if (error.response.status === 404) {
                errorMessageTextElement.textContent = "User not found on GitHub";
            }
            else if (error.response.status === 403) {
                errorMessageTextElement.textContent = "Access to GitHub API forbidden";
            }
            errorMessageElement.classList.replace("d-none", "d-block");
        });        

    axios.get(reposUrl)
        .then(function(response){
            let repositoryDetailsElement = document.querySelector(".repository-details");
            let reposList = response.data;
            let numberOfRepos = 0;
            let totalStars = 0;
            let totalForks = 0;
            let totalWatchers = 0;

            repositoryDetailsElement.innerHTML = "";


            reposList.forEach(function(item){
                totalStars += item.stargazers_count;
                totalForks += item.forks_count;
                totalWatchers += item.watchers_count;
            });

            totalStarsTextElement.textContent = totalStars;
            totalForksTextElement.textContent = totalForks;
            totalWatchersTextElement.textContent = totalWatchers;

            for (let i = 0; i < reposList.length; i++){
                let reposElement = `<div class="repos repos${numberOfRepos}"><div class="title"><h3 class="repos-title${numberOfRepos}"></h3></div><div class="description"><p class="repos-paragraph${numberOfRepos}"></p></div><div class="topics"></div></div>`;

                repositoryDetailsElement.innerHTML += reposElement;
                let reposTitleSelector = document.querySelector(`.repos-title${numberOfRepos}`);
                let reposParagraphSelector = document.querySelector(`.repos-paragraph${numberOfRepos}`);
                let topicParentElement = document.querySelector(`.repos${numberOfRepos} .topics`);

                reposTitleSelector.textContent = reposList[i].name;
                reposParagraphSelector.textContent = reposList[i].description;

                for (let j = 0; j < reposList[i].topics.length; j++) {
                    let topicElement = `<span class="topic topic${numberOfRepos}">${reposList[i].topics[j]}</span>`;
                    topicParentElement.innerHTML += topicElement;
                }

                numberOfRepos++;
            }
        });
}
