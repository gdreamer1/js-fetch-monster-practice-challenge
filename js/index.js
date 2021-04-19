let currentPage = 1
const limit = 50

document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('back')
    backButton.onclick = handleBackClick
    backButton.style.display = 'none' // on initial render, this doesn't need to display

    const forwardButton = document.getElementById('forward')
    forwardButton.onclick = handleForwardClick

    fetchMonsters()
})


function fetchMonsters() {
    console.log('Limit, current page: ', limit, currentPage)

    fetch(`http://localhost:3000/monsters/?_limit=${limit}&_page=${currentPage}`)
    .then(monsters => monsters.json())
    .then(monsters => renderMonsters(monsters))
    .catch(error => renderMonsters('Error fetching monsters'))
}

function renderMonsters(monsters) {
    console.log('Monster: ', monsters);
    const monstersList = document.getElementById('monsters-list')

    while (monstersList.firstChild) {
        monstersList.removeChild(monstersList.firstChild);
    }

    if (monsters.forEach) {
        monsters.forEach(monster => {
            const li = document.createElement('li')

            const nameSpan = document.createElement('span')
            nameSpan.innerHTML = monster.name + '</br>'

            const ageSpan = document.createElement('span')
            ageSpan.innerHTML = "Age: " + monster.age + '</br>'

            const descriptionSpan = document.createElement('span')
            descriptionSpan.innerHTML = "Description: " + monster.description + '</br></br>'

            li.appendChild(nameSpan)
            li.appendChild(ageSpan)
            li.appendChild(descriptionSpan)

            monstersList.appendChild(li)
        })
    } else {
        const li = document.createElement('li')
        li.innerHTML = monsters;
        monstersList.appendChild(li)
    }
}

function handleBackClick(event) {
    event.preventDefault()

    currentPage -= 1

    if (currentPage === 1) {
        const backButton = document.getElementById('back')
        backButton.style.display = 'none'
    }

    fetchMonsters()
}

function handleForwardClick(event) {
    event.preventDefault()    

    currentPage += 1

    const backButton = document.getElementById('back')
    if (backButton.style.display === 'none') {
        backButton.style.display = 'inline-block'
    }

    fetchMonsters()
}

function createMonster(event) {
    event.preventDefault()
    const form = document.getElementById('monster-form')
    
    let monster = {}
    Array.from(form.children).forEach(field => {
        console.log('Field: ', field)

        if (field.name === 'name') {
            monster.name = field.value
        }

        if (field.name === 'age') {
            monster.age = field.value
        }

        if (field.name === 'description') {
            monster.description = field.value
        }
    })

    console.log('Monster to create: ', monster)

    fetch('http://localhost:3000/monsters', {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(monster),
        method: 'POST'
    }).then(monsterResponse => {
        console.log('Monster Success Response: ', monsterResponse)
    }).catch(error => {
        console.log('Post monster error: ', error)
    })
}

const createMonsterForm = document.getElementById('monster-form')
createMonsterForm.addEventListener('submit', createMonster)