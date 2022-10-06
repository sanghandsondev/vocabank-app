import 'core-js/stable'                     // polyfilling everything else
import { TIME_LIVE, TIME_SUGGEST } from './config'
import '@babel/polyfill'

const btnDeleteItem = document.querySelector('.btn--delete-item')
const btnExitAction = document.querySelector('.btn--exit-action')
const btnAddItem = document.querySelector('.add--item')
const inputWord = document.querySelector('#word')
const inputMeaning = document.querySelector('#meaning')
const formAddItem = document.querySelector('.form__add-item')
const formSearchItem = document.querySelector('.form__search-item')
const inputSearch = document.querySelector('#search')
const btnClearItems = document.querySelector('.clear-all')
const btnWordTest = document.querySelector('.word-test')
const listContent = document.querySelector('.list')
const testContent = document.querySelector('.test')
const btnStartTest = document.querySelector('.start-test')
const formTestWord = document.querySelector('.form__test-word')

// LOCAL MODAL

let listItem = []
let timeTest
let timeLive = TIME_LIVE
let timeSuggest = TIME_SUGGEST

const getModal = async () => {
    const list = await localStorage.getItem('items')
    if (!list) return
    listItem = JSON.parse(list)
}


// document.addEventListener("DOMContentLoaded", init)

// EVENT

if (inputSearch) {
    inputSearch.addEventListener('input', (e) => {
        renderList()
    })
}

if (formAddItem) {
    formAddItem.addEventListener('submit', (e) => {
        e.preventDefault()
        const word = inputWord.value.trim()
        const meaning = inputMeaning.value.trim()
        const isUnique = checkUniqueWord(word)

        // console.log({ word, meaning })
        if (btnAddItem.textContent === "Lưu lại") {
            let id = btnAddItem.getAttribute('id')
            updateItem(meaning, Number(id))
        } else {
            if (isUnique) {
                alert("Word bạn nhập đã tồn tại :(")
                return
            }
            addItem({ word, meaning })
        }
        // console.log(listItem)
        renderList()
        inputWord.value = ''
        inputWord.focus()
        inputMeaning.value = ''
    })
}

if (btnDeleteItem) {
    btnDeleteItem.addEventListener('click', (e) => {
        const id = btnDeleteItem.getAttribute('id-delete')
        // console.log(typeof id)
        deleteItem(Number(id))
    })
}

if (btnExitAction) {
    btnExitAction.addEventListener('click', (e) => {
        btnDeleteItem.classList.add('hidden')
        btnExitAction.classList.add('hidden')
        btnAddItem.textContent = "Thêm"
        btnAddItem.removeAttribute('id')
        inputWord.removeAttribute('disabled')
        inputWord.value = ''
        inputMeaning.value = ''
    })
}

if (btnClearItems) {
    btnClearItems.addEventListener('click', () => {
        if (confirm("Are you sure about that? ")) {
            if (confirm("Thật?")) {
                if (confirm("Nhiều từ lắm đó nha?")) {
                    if (prompt("Bạn cần nhập 'ok' để xóa tất cả :(((") === "ok") {
                        clearAllItems()
                        renderList()
                    }
                }
            }

        }
    })
}

if (btnWordTest) {
    btnWordTest.addEventListener('click', () => {
        if (btnWordTest.textContent === "Word Test") {
            listContent.classList.add("hidden")
            btnWordTest.textContent = "List Word"
            testContent.classList.remove("hidden")
            return false
        }
        listContent.classList.remove("hidden")
        testContent.classList.add("hidden")
        btnWordTest.textContent = "Word Test"
    })
}

if (btnStartTest) {
    btnStartTest.addEventListener('click', () => {
        if (btnStartTest.textContent === "Bỏ cuộc") {
            if (confirm("Bạn thực sự muốn bỏ cuộc?")) {
                removeWordTest()
                alert("Lần sau cố gắng đừng bỏ cuộc bạn nhé")
                return false
            } else { return }

        }
        timeTest = prompt("Bạn muốn kiểm tra bao nhiêu lượt ? (Vui lòng nhập một số nguyên dương)")
        if (!Number.isInteger(Number(timeTest))) {
            alert("Bạn cần nhập một số nguyên!!!")
            return false
        }
        if (timeTest <= 0) {
            alert("Bạn cần nhập một số nguyên dương!!!")
            return false
        }
        btnStartTest.textContent = "Bỏ cuộc"
        document.querySelector('.time-test').textContent = timeTest
        document.querySelector('.time-live').textContent = timeLive
        document.querySelector('.time-suggest').textContent = timeSuggest
        renderWordTest(listItem)
    })
}

if (formTestWord) {
    formTestWord.addEventListener('submit', (e) => {
        e.preventDefault()
        const id = document.querySelector('.check-ans').getAttribute('id')
        const meaning = listItem[id].meaning
        const listAnswer = listItem.filter((item, index) => {
            return item.meaning === meaning
        })
        // console.log(listAnswer)
        const checkAns = listAnswer.some((el) => {
            return el.word === document.querySelector('#wordtest').value
        })
        if (!checkAns) {
            document.querySelector('.answer').classList.add("wrong")
            document.querySelector('.answer').textContent = "Sai"
            timeLive--
            document.querySelector('.time-live').textContent = timeLive
            if (timeLive === 0) {
                alert("Đồ ngu! Đồ ăn hại! Chết mẹ mày đi :(((\nNói chứ bạn cần cố gắng nhiều hơn nữa. Fighting!!")
                removeWordTest()
            }
            document.querySelector('#wordtest').focus()
            return false
        }

        document.querySelector('.answer').textContent = `Đúng. Answer: ${document.querySelector('#wordtest').value}`
        document.querySelector('.answer').classList.remove("wrong")
        timeTest--
        document.querySelector('.time-test').textContent = timeTest
        // console.log(timeTest)
        if (timeTest === 0) {
            alert(`Chúc mừng bạn đã hoàn thành bài test <3\nSiêu cấp provjp`)
            removeWordTest()
            return false
        }
        renderWordTest(listItem)
        document.querySelector('#wordtest').focus()
    })
}

if (formSearchItem) {
    formSearchItem.addEventListener('submit', (e) => {
        e.preventDefault()
    })
}


// CONTROLLER

const findItemById = (id) => {
    return listItem.find((item, index) => {
        return item.id === id
    })
}

const persistItems = () => {    // update items into localstorage
    localStorage.setItem('items', JSON.stringify(listItem))
}

const updateItem = (meaning, id) => {
    const item = findItemById(id)
    // console.log(item)
    const index = listItem.indexOf(item)
    listItem[index].meaning = meaning
    persistItems()
    btnAddItem.textContent = "Thêm"
    btnAddItem.removeAttribute('id')
    inputWord.removeAttribute('disabled')
    btnDeleteItem.classList.add("hidden")
    btnExitAction.classList.add("hidden")
}

const addItem = (item) => {
    // console.log(item)
    item.id = Date.now()  // add Id off the word
    listItem.push(item)
    persistItems()
}

const clearAllItems = () => {
    listItem = []
    localStorage.removeItem('items')
}

const checkUniqueWord = (word) => {
    return listItem.some((item, index) => {
        return item.word === word
    })
}

const resultSearch = (input) => {
    // console.log(listItem)
    return listItem.filter((item, index) => {
        return item.word.startsWith(input) === true
    })
}

const deleteItem = (id) => {
    if (confirm("Are you sure about that? ")) {
        const item = findItemById(id)
        listItem.splice(listItem.indexOf(item), 1)
        persistItems()
        renderList()
        btnAddItem.textContent = "Thêm"
        btnAddItem.removeAttribute('id')
        inputWord.removeAttribute('disabled')
        btnDeleteItem.classList.add("hidden")
        btnExitAction.classList.add("hidden")
    }
    inputWord.value = ''
    inputMeaning.value = ''
}

const editItem = (id) => {
    if (id === 0) return
    const item = findItemById(id)
    // console.log(id)
    // console.log(typeof item.word)
    formAddItem.classList.remove('hidden')
    // console.log(typeof item.word)
    inputWord.value = item.word
    inputWord.setAttribute('disabled', '')
    inputMeaning.value = item.meaning
    btnAddItem.textContent = "Lưu lại"
    btnAddItem.setAttribute('id', id)
    btnDeleteItem.classList.remove('hidden')
    btnDeleteItem.setAttribute('id-delete', id)
    btnExitAction.classList.remove('hidden')
}

const suggestFirstChar = (index) => {
    const meaning = listItem[index].meaning
    const listSuggest = listItem.filter((item, index) => {
        return item.meaning === meaning
    })
    const firstCharSug = listSuggest.map((item, index) => {
        return item.word.charAt(0)
    })
    const random = Math.floor(Math.random() * firstCharSug.length)
    // console.log(random)
    document.querySelector('#wordtest').value = firstCharSug[random]
}

const suggest = (index) => {
    if (timeSuggest === 0) {
        alert("Bạn đã hết lượt gợi ý\nBỏ cuộc thôi :))")
        return false
    }
    // const meaning = listItem
    const meaning = listItem[index].meaning
    const listSuggest = listItem.filter((item, index) => {
        return item.meaning === meaning
    })
    // console.log(listSuggest)
    document.querySelector('.suggest').innerHTML = listSuggest.map((el) => {
        return `
        <li class="right">${el.word}</li>
    `
    }).join('')
    timeSuggest--
    document.querySelector('.time-suggest').textContent = timeSuggest
}

const removeWordTest = () => {
    formTestWord.innerHTML = ''
    document.querySelector('.suggest').innerHTML = ''
    document.querySelector('.answer').textContent = ''
    btnStartTest.textContent = "Bắt đầu kiểm tra"
    document.querySelector('.time-test').textContent = ''
    document.querySelector('.time-live').textContent = ''
    document.querySelector('.time-suggest').textContent = ''
    timeLive = TIME_LIVE
    timeSuggest = TIME_SUGGEST
}

// VIEW

const renderList = () => {
    const listContent = document.querySelector('.list__word')
    listContent.innerHTML = ''
    // let listRender = inputSearch.value !== "" ? list : resultSearch(inputSearch.value)
    // console.log(inputSearch.value)
    // console.log(listRender)
    const markup = resultSearch(inputSearch.value).map((item, index) => {
        return `
        <li class="list__item">
            <a href="#${item.id}">
                <span class"list__item--index>${item.id}</span>
                <span class="list__item--name">${item.word}</span>
                <span class="list__item--meaning">${item.meaning}</span>
            </a>
        </li>
        `

    }).join('')
    listContent.insertAdjacentHTML('afterbegin', markup)

    window.addEventListener('hashchange', (e) => {
        editItem(Number(location.hash.slice(1)))
        location.hash = ''
    })


}

const renderWordTest = (list) => {
    const length = list.length
    const random = Math.floor(Math.random() * length) //  random < length
    const markup1 = `
            <label for="wordtest">Word</label>
            <input type="text" name="wordtest" id="wordtest" autocomplete="off">

            <label for="meaningtest">Meaning</label>
            <input type="text" name="meaningtest" id="meaningtest" disabled value="${list[random].meaning}">

            <button id="${random}" class="check-ans">Check</button>
    `
    const markup2 = `
        <button class = "btn--suggest-fir" data-index=${random}>Gợi ý chữ cái đầu</button>
        <button class = "btn--suggest" data-index=${random}>Gợi ý cmnl</button>
    `
    formTestWord.innerHTML = markup1
    document.querySelector('.suggest').innerHTML = markup2

    const addHandlerSuggestFirstChar = (handler) => {
        document.querySelector('.btn--suggest-fir').addEventListener('click', (e) => {
            const btn = e.target
            if (!btn) return
            const index = btn.dataset.index
            // console.log(typeof index)
            handler(index)
        })
    }

    const addHandlerSuggest = (handler) => {
        document.querySelector('.btn--suggest').addEventListener('click', (e) => {
            const btn = e.target
            if (!btn) return
            const index = btn.dataset.index
            handler(index)
        })
    }

    addHandlerSuggestFirstChar(suggestFirstChar)
    addHandlerSuggest(suggest)

}

// INIT
const init = async () => {
    await getModal()   // get data from localstorage
    renderList()
}
init()







