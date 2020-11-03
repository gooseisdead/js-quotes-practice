const quoteList = document.querySelector("#quote-list")
const newQuoteForm = document.querySelector("#new-quote-form")
const createdAt = Date.now()

function renderQuote(quoteObj) {
    quoteList.innerHTML += `
    <li class='quote-card' id="data-${quoteObj.id}">
        <blockquote class="blockquote">
            <p class="quote">"${quoteObj.quote}"</p>
            <footer class="blockquote-footer">${quoteObj.author}</footer>
            <br>
            <button class='btn-success' data-id="${quoteObj.id}">Likes: <span>${quoteObj.likes.length}</span></button>
            <button class='btn-danger' data-id="${quoteObj.id}">Delete</button>
            <button class='btn-update' data-id="${quoteObj.id}">Edit</button>
        </blockquote>
    </li>`
}

quoteList.addEventListener("click", (event) => {
    let id = event.target.dataset.id
    let quoteCard = event.target.parentElement.parentElement
    if (event.target.tagName === "BUTTON" && event.target.className === "btn-danger"){
        fetch(`http://localhost:3000/quotes/${id}`,{
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(deletedQuote => {
            quoteCard.remove()
        })
    }

    else if(event.target.tagName === "BUTTON" && event.target.className === "btn-success"){
        let quoteIdInteger = parseInt(id)
        let newLikeCount = parseInt(event.target.firstElementChild.innerText) + 1

        fetch("http://localhost:3000/likes", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
            quoteId: quoteIdInteger,
            })
        })
        .then(response => response.json())
        .then(createdLike => {
            event.target.firstElementChild.innerText = newLikeCount
        })
    }

})

newQuoteForm.addEventListener("submit", creationEvent)

function creationEvent(event) {
    event.preventDefault();
    let quote = event.target.quote.value
    let author = event.target.author.value

    fetch("http://localhost:3000/quotes", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            quote: quote,
            author: author,
            timestamp: createdAt
        })
    })
    .then(res => res.json())
    .then(newQuote => {
        newQuote.likes = []
        renderQuote(newQuote)
    })
    event.target.reset()
}

function renderAllQuotes(quotesData) {
    quotesData.forEach(renderQuote)
}

function initialize () {
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(response => response.json())
    .then(quotesData => {
        renderAllQuotes(quotesData)
    })
}

initialize ()