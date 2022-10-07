import 'core-js/stable'                     // polyfilling everything else
import '@babel/polyfill'
// import 'regenerator-runtime/runtime'        // polyfilling async/await
import { TIME_LIVE_GAME_1, TIME_SUGGEST_GAME_1 } from './config'
import { isEmail, isWordUnique, existMaxChar } from './utils'
import { login, logout } from './auth'
import { toastShow } from './custom'
import { async } from 'regenerator-runtime'

const app = document.querySelector('.js-app')
const headerEl = document.querySelector('.js-header')
const contentEl = document.querySelector('.js-content')
const mainEl = document.querySelector('.js-main')
const accountEl = document.querySelector('.js-account')
const btnGame1 = document.querySelector('.js-game-1')
const userEl = document.querySelector('.js-user')


// LOCAL MODAL STATE
let g_listWord = []
let g_user
let g_timeTest
let g_timeSuggest
let g_timeLive

const getListWordFromLocalStorage = async () => {
    const list = await localStorage.getItem('listword')
    if (!list) return
    g_listWord = JSON.parse(list)
}

const getUserFromLocalStorage = async () => {
    const user = await localStorage.getItem('user')
    if (!user) g_user = {}
    g_user = JSON.parse(user)
}

// MAIN CONTROLLER
const clear = (parentElement) => {
    parentElement.innerHTML = ''
}

const renderSpinner = (parentElement) => {
    const markup = `
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
        </div>
    </div>
    `
    clear(parentElement)
    parentElement.insertAdjacentHTML('afterbegin', markup)
}

const renderView = (parentElement, markup) => {
    clear(parentElement)
    parentElement.insertAdjacentHTML('afterbegin', markup)
}

const updateViewData = (parentElement, markup) => {

}

// Data
const persistListWordLocalStorage = () => {
    localStorage.setItem('listword', JSON.stringify(g_listWord))
}

const findWordById = (id) => {
    return g_listWord.find((el) => {
        return el.id === id
    })
}

const addWordToLocalStorage = (data) => {
    data.id = Date.now()
    g_listWord.push(data)
    persistListWordLocalStorage()
}

const clearListWordLocalStorage = () => {
    g_listWord = []
    localStorage.removeItem('listword')
}

const resultSearchListWord = (input) => {
    return g_listWord.filter((el) => {
        return el.word.startsWith(input) === true
    })
}

const removeWordToLocalStorage = (id) => {
    const word = findWordById(id)
    if (!word) return
    const index = g_listWord.indexOf(word)
    g_listWord.splice(index, 1)
    persistListWordLocalStorage()
}

const updateWordToLocalStorage = (newWord, id) => {
    const word = findWordById(id)
    if (!word) return
    const index = g_listWord.indexOf(word)
    g_listWord[index].word = newWord.word
    g_listWord[index].meaning = newWord.meaning
    persistListWordLocalStorage()
}

// HANDLE EVENT - Initial Load
if (btnGame1) {
    btnGame1.addEventListener('click', async () => {
        if (!g_user) return
        await getListWordFromLocalStorage()
        g_timeSuggest = TIME_SUGGEST_GAME_1
        g_timeLive = TIME_LIVE_GAME_1
        renderGame1()
    })
}

// ----------------------- RENDER VIEW-----------------------------
const renderGame1 = () => {
    clear(mainEl)
    renderSpinner(mainEl)
    renderView(mainEl, game1Markup(g_listWord))
    // add handler here for game 1 view
    addHandlerFocusTimeTestInput()
    addHandlerSubmitTimeTestForm()
    addHandlerSubmitCheckAnswerForm()
}

const renderOptionLogin = () => {
    clear(accountEl)
    renderSpinner(accountEl)
    renderView(accountEl, optionLoginMarkup())
    // add handler
    addHandlerRenderOptionLogin()
    addHandlerRenderSignup()
}

const renderLoginWithEmail = () => {
    clear(accountEl)
    renderSpinner(accountEl)
    renderView(accountEl, formLoginWithEmailMarkup())
    // add handler
    addHandlerSubmitLogin()
}

const renderSignup = () => {
    clear(accountEl)
    renderSpinner(accountEl)
    renderView(accountEl, formSignUpMarkup())
    // add handler
}

const renderUserDisplay = (user) => {
    clear(userEl)
    renderView(userEl, userDisplayMarkup())
    // add handler
    addHandlerLogOut()
    addHandlerRenderListWordTable()
}

const renderLoginClick = () => {
    clear(userEl)
    renderView(userEl, loginClickMarkup())
    //add handler
    addHandlerClickLogIn()
}

const renderListWordTable = async () => {
    clear(accountEl)
    renderSpinner(accountEl)
    await getListWordFromLocalStorage()
    renderView(accountEl, listWordTableMarkup(g_listWord))
    // add handler
    addHandlerRenderAddWordInput()
    addHandlerInputSearchWord()
    addHandlerRenderEditWordInput()
}

const renderSearchListWordTable = () => {
    const listword = document.querySelector('.js-list-word-table')
    const inputSearch = document.querySelector('#inputSearchWord')
    clear(listword)
    renderSpinner(listword)
    renderView(listword, updateListWordMarkup(resultSearchListWord(inputSearch.value)))
    // add handler
    addHandlerRenderEditWordInput()
}

//------------------------ MARKUP -------------------------------
const game1Markup = (list) => {
    const length = list.length
    const random = Math.floor(Math.random() * length)
    return `
        <button type="button" class="btn btn-primary js-btn-start-game" data-toggle="modal" data-target="#timeTestModal">
            Bắt đầu trò chơi
        </button>
        
        <div class="js-game-1 hidden"> 
            <button type="button" class="btn btn-outline-primary js-time-test-display" disabled>
                Luợt kiểm tra:
                <span class="text-dark"></span>
            </button>

            <button type="button" class="btn btn-outline-primary ml-5 js-time-live-display" disabled>
                Lượt gợi ý còn lại:
                <span class="text-dark">${g_timeSuggest}</span>
            </button>

            <button type="button" class="btn btn-outline-primary ml-5 js-time-suggest-display" disabled>
                Số mạng còn lại của bạn:
                <span class="text-dark">${g_timeLive}</span>
            </button>

            <form class="js-form-check-answer mt-3">
                <div class="form-group">
                    <label for="inputWordGame1">Từ</label>
                    <input type="text" class="form-control" id="inputWordGame1" placeholder="Nhập từ..." autocomplete="off">
                </div>
                <div class="form-group">
                    <label for="inputMeaningGame1">Nghĩa</label>
                    <input type="text" class="form-control" id="inputMeaningGame1" disabled value="${list[random].meaning}">
                </div>
                <button id=${random} type="submit" class="btn btn-primary">Kiểm tra đáp án</button>
            </form>

            <button type="button" class="btn btn-outline-info mt-3 js-btn-suggest-first-char">
                Gợi ý chữ cái đầu
            </button>
            <button type="button" class="btn btn-outline-info ml-3 mt-3 js-btn-suggest">
                Gợi ý từ
            </button>
        </div>

    `
}

const optionLoginMarkup = () => {
    return `
    <div class="js-login-options">
        <h3 class="mb-3">Lựa chọn đăng nhập</h3>
        <button type="button" class="btn btn-outline-secondary btn-block js-btn-login-email">Đăng nhập với
            email</button>
        <button type="button" class="btn btn-outline-primary btn-block js-btn-login-facebook">Đăng nhập với
            Facebook</button>
        <button type="button" class="btn btn-outline-danger btn-block js-btn-login-google">Đăng nhập với
            Google</button>
        <p class="text-secondary mt-3">Bạn chưa có tài khoản?
            <a href="#" class=" text-dark js-signup">Đăng ký ngay</a>
        </p>
    </div>
    `
}

const formLoginWithEmailMarkup = () => {
    return `
    <form class="js-form-login">
        <h3 class="mb-3">Đăng nhập</h3>
        <div class="form-group">
            <label for="inputLoginEmail">Email</label>
            <input type="text" class="form-control" id="inputLoginEmail"
                aria-describedby="inputLoginEmailHelp" placeholder="Địa chỉ email..."
                autocomplete="off">
            <div class="invalid-feedback">
                Trường này phải nhập một email.
            </div>
        </div>
        <div class="form-group">
            <label for="inputLoginPassWord">Mật khẩu</label>
            <input type="password" class="form-control" id="inputLoginPassWord"
                placeholder="Mật khẩu..." autocomplete="off">
            <div class="invalid-feedback">
                Mật khẩu cần ít nhất 6 ký tự.
            </div>
        </div>
        <p class="text-secondary">Quên mật khẩu?
            <a href="#" class="text-dark js-forgot-password">Click here</a>
        </p>
        <button type="submit" class="btn btn-primary btn-block">Đăng nhập</button>
    </form>
    `
}

const formSignUpMarkup = () => {
    return `
    <form class="js-form-signup">
        <h3 class="mb-3">Đăng ký tài khoản</h3>
        <div class="form-group">
            <label for="inputSignupEmail">Email</label>
            <input type="text" class="form-control" id="inputSignupEmail"
                aria-describedby="inputSignupEmailHelp" placeholder="Địa chỉ email..."
                autocomplete="off">
            <div class="invalid-feedback">
                Trường này phải nhập một email.
            </div>
        </div>
        <div class="form-group">
            <label for="inputSignupUsername">Họ và Tên</label>
            <input type="text" class="form-control" id="inputSignupUsername"
                aria-describedby="inputSignupUsernameHelp" placeholder="Họ và tên của bạn..."
                autocomplete="off">
            <div class="invalid-feedback">
                Trường này nhập ít nhất 4 ký tự, tối đa 30 kí tự.
            </div>
        </div>
        <div class="form-group">
            <label for="inputLoginPassWord">Mật khẩu</label>
            <input type="password" class="form-control" id="inputLoginPassWord"
                placeholder="Mật khẩu...">
            <div class="invalid-feedback">
                Mật khẩu nhập ít nhất 6 ký tự.
            </div>
        </div>
        <div class="form-group">
            <label for="inputLoginPassWord">Xác nhận mật khẩu</label>
            <input type="password" class="form-control" id="inputLoginPassWord"
                placeholder="Xác nhận mật khẩu...">
            <div class="invalid-feedback">
                Mật khẩu không trùng khớp.
            </div>
        </div>

        <button type="submit" class="btn btn-primary btn-block">Đăng ký</button>
    </form>
    `
}

const loginClickMarkup = () => {
    return `
    <li class="nav-item mr-5">
        <a class="nav-link js-login" href="#">Đăng nhập</a>
    </li>
    `
}

const userDisplayMarkup = () => {
    return `
    <li class="nav-item dropdown mr-5">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            ${g_user.username}
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item js-user-info" href="#">Trang cá nhân</a>
            <a class="dropdown-item js-user-vocab" href="#">Quản lý từ vựng</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item js-logout" href="#">Đăng xuất</a>
        </div>
    </li>
    `
}

const listWordTableMarkup = (list) => {
    // resultSearchListWord(input)
    const markup = list.map((el, index) => {

        return `
        <tr id="${el.id}">
            <th scope="row">    
                ${el.word}
            </th>
            <td>
                ${el.meaning = el.meaning.length > 20 ? el.meaning.slice(0, 20) + "..." : el.meaning}
            
            </td>
            <td>
                <button type="button" class="btn btn-outline-danger btn-sm js-btn-remove-word"
                    data-toggle="modal" data-target="#confirmRemoveWordModal">Xóa</button>
            </td>
        </tr>  
        `
    }).join('')

    return `
    <div class="input-group mb-3">
        <input type="text" class="form-control" id="inputSearchWord" autocomplete="off" placeholder="Nhập tìm kiếm từ..." aria-label="Recipient's username" >
        <div class="input-group-append">
            <button type="button" class="btn btn-outline-info js-btn-add-word">Thêm</button>
        </div>
    </div>
    

    <table class="table table-sm table-striped js-list-word-table">
        <thead>
            <tr>
                <th scope="col">Từ</th>
                <th scope="col">Nghĩa</th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
            ${markup}
        </tbody>
    </table>
    `
}

const updateListWordMarkup = (list) => {
    if (list.length === 0) return `
        <thead>
                <tr>
                    <th scope="col">Từ</th>
                    <th scope="col">Nghĩa</th>
                    <th scope="col"></th>
                </tr>
        </thead>
        <p class="text-info mt-3"> Không tìm thấy kết quả </p>
        <tbody>
           
        </tbody>
    `
    const markup = list.map((el, index) => {
        return `
        <tr id="${el.id}">
            <th scope="row">    
                ${el.word}
            </th>
            <td>
            ${el.meaning = el.meaning.length > 20 ? el.meaning.slice(0, 20) + "..." : el.meaning}
            </td>
            <td>
            <button type="button" class="btn btn-outline-danger btn-sm js-btn-remove-word"
                data-toggle="modal" data-target="#confirmRemoveWordModal">Xóa</button>
            </td>
        </tr>    
        `
    }).join('')
    return `
        <thead>
            <tr>
                <th scope="col">Từ</th>
                <th scope="col">Nghĩa</th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
            ${markup}
        </tbody>
    `
}

// ------------------------- ADD HANDLER -------------------------------
// Game 1
const addHandlerFocusTimeTestInput = () => {
    document.querySelector('#timeTestModal').addEventListener('click', (e) => {
        document.querySelector('#inputTimeTest').focus()
    })
    document.addEventListener('keydown', () => {
        document.querySelector('#inputTimeTest').focus()
    })
}

const addHandlerSubmitTimeTestForm = () => {
    document.querySelector('.js-form-time-test').addEventListener('submit', (e) => {
        e.preventDefault()
        const timeTest = document.querySelector('#inputTimeTest').value
        // console.log(timeTest)
        if (!Number.isInteger(Number(timeTest))) {
            document.querySelector('#timeTestHelp').textContent = `Bạn cần nhập một số nguyên.`
            return false
        }
        if (timeTest <= 0) {
            document.querySelector('#timeTestHelp').textContent = `Bạn cần nhập một số nguyên dương.`
            return false
        }
        g_timeTest = timeTest
        $('#timeTestModal').modal('hide')
        document.querySelector('.js-game-1').classList.toggle('hidden')
        document.querySelector('.js-btn-start-game').classList.toggle('hidden')
        document.querySelector('.js-time-test-display span').textContent = g_timeTest
        document.querySelector('#inputWordGame1').focus()
    })
}

const addHandlerSubmitCheckAnswerForm = () => {
    document.querySelector('.js-form-check-answer').addEventListener('submit', (e) => {
        // e.preventDefault()
    })
}

// Auth + User
const addHandlerRenderOptionLogin = () => {
    const btnLoginwithEmail = document.querySelector('.js-btn-login-email')
    const btnLoginwithFacebook = document.querySelector('.js-btn-login-facebook')
    const btnLoginwithGoogle = document.querySelector('.js-btn-login-google')
    btnLoginwithEmail.addEventListener('click', () => {
        renderLoginWithEmail()
    })
}

const addHandlerRenderSignup = () => {
    document.querySelector('.js-signup').addEventListener('click', (e) => {
        renderSignup()
    })
}

const addHandlerClickLogIn = () => {
    document.querySelector('.js-login').addEventListener('click', () => {
        renderOptionLogin()
    })
}

const addHandlerSubmitLogin = () => {
    document.querySelector('.js-form-login').addEventListener('submit', async (e) => {
        e.preventDefault()
        await login({ username: "Hoàng Trung Sang", email: "sangank@gmail.com" })
        await getUserFromLocalStorage()
        renderUserDisplay()
        renderListWordTable()
    })
}

const addHandlerLogOut = () => {
    document.querySelector('.js-logout').addEventListener('click', (e) => {
        logout()
        g_user = {}
        getUserFromLocalStorage()
        renderLoginClick()
        clear(accountEl)
        g_listWord = []
    })
}

const addHandlerRenderListWordTable = () => {
    document.querySelector('.js-user-vocab').addEventListener('click', () => {
        renderListWordTable()
    })
}

// List word table
const addHandlerRenderAddWordInput = () => {
    document.querySelector('.js-btn-add-word').addEventListener('click', (e) => {
        const btn = e.target
        const tbody = document.querySelector('.js-list-word-table tbody')
        const markup = `
        <tr>
            <td>
                <div class="form-group mb-0">
                    <input type="text" id= "inputAddWord" class="form-control" 
                        autocomplete="off" aria-describedby="inputAddWordHelp" >
                    <div class="invalid-feedback">
                        Từ này đã tồn tại.
                    </div>
                    <small id="inputAddWordHelp" class="form-text text-danger">
                    </small>
                </div>
            </td>
            <td>
                <div class="form-group mb-0">
                    <textarea id= "inputAddMeaning" class="form-control" 
                        autocomplete="off" aria-describedby="inputAddMeaningHelp" rows="1"></textarea>
                    <div class="invalid-feedback">
                        Tối đa 50 ký tự.
                    </div>
                    <small id="inputAddMeaningHelp" class="form-text text-danger"></small>
                </div>
            </td>
            <td>
                <button class="btn btn-outline-info js-add-word">Thêm</button>
            </td>
        </tr>
        `
        if (btn.textContent === "Hủy") {
            btn.textContent = "Thêm"
            // tbody.querySelector(':first-child').outerHTML = ''
            tbody.removeChild(tbody.querySelector(':first-child'))
            document.querySelector('#inputSearchWord').removeAttribute('disabled')
            return false
        }
        btn.textContent = "Hủy"
        tbody.insertAdjacentHTML('afterbegin', markup)
        tbody.querySelector('#inputAddWord').focus()
        document.querySelector('#inputSearchWord').setAttribute('disabled', 'true')
        // Add Handler
        addHandlerAddWord()
    })

}

const addHandlerAddWord = () => {
    const handleAddWordSuccess = (newWord) => {
        document.querySelector('#inputAddWord').value = ''
        document.querySelector('#inputAddWord').focus()
        document.querySelector('#inputAddMeaning').value = ''
        document.querySelector('#inputAddWordHelp').textContent = ''
        document.querySelector('#inputAddMeaningHelp').textContent = ''
        document.querySelector('#inputAddWord').classList.remove('is-invalid')
        document.querySelector('#inputAddMeaning').classList.remove('is-invalid')
        const markup = `
        
        <tr>
            <th scope="row">${newWord.word}</th>
            <td>${newWord.meaning = newWord.meaning.length > 20 ? newWord.meaning.slice(0, 20) + "..." : newWord.meaning}</td>
            <td>
                <button type="button" class="btn btn-outline-success btn-sm">New</button>
            </td>
        </tr>
        `
        // console.log(document.querySelector('.js-list-word-table tbody').firstElementChild)
        document.querySelector('.js-list-word-table tbody').firstElementChild.insertAdjacentHTML('afterend', markup)
    }
    const handleAddWord = () => {
        const word = document.querySelector('#inputAddWord').value.trim()
        const meaning = document.querySelector('#inputAddMeaning').value.trim()
        if (!word) {
            document.querySelector('#inputAddWordHelp').textContent = 'Bạn cần nhập trường này.'
            return
        }
        if (!meaning) {
            document.querySelector('#inputAddMeaningHelp').textContent = 'Bạn cần nhập trường này.'
            return
        }
        if (!isWordUnique(word, g_listWord)) {
            document.querySelector('#inputAddWord').classList.add('is-invalid')
            return
        }
        if (!existMaxChar(meaning, 50)) {
            document.querySelector('#inputAddMeaning').classList.add('is-invalid')
            return
        }
        // Add word success
        addWordToLocalStorage({ word, meaning })
        handleAddWordSuccess({ word, meaning })
    }
    document.querySelector('.js-add-word').addEventListener('click', (e) => {
        handleAddWord()
    })
    document.querySelector('#inputAddMeaning').addEventListener('keypress', (e) => {
        if (e.key === "Enter") {
            document.querySelector('.js-add-word').click()
        }
    })
    document.querySelector('#inputAddWord').addEventListener('keypress', (e) => {
        if (e.key === "Enter") {
            document.querySelector('#inputAddMeaning').focus()
        }
    })
    document.querySelector('#inputAddWord').addEventListener('input', (e) => {
        e.target.value = e.target.value.toLowerCase()
    })
}

const addHandlerInputSearchWord = () => {
    document.querySelector('#inputSearchWord').addEventListener('input', (e) => {
        e.target.value = e.target.value.toLowerCase()
        renderSearchListWordTable()
    })
}

const addHandlerRenderEditWordInput = () => {
    const listWord = document.querySelectorAll('.js-list-word-table tbody tr[id]')
    for (let word of listWord) {
        word.addEventListener('click', (e) => {
            let id = Number(word.getAttribute('id'))
            const btnRemoveWord = e.target.closest('.js-btn-remove-word')
            // console.log(id)
            // console.log(btnRemoveWord)
            if (btnRemoveWord) {
                // Remove Word
                document.querySelector('.js-btn-confirm-remove-word').addEventListener('click', (e) => {
                    removeWordToLocalStorage(id)
                    $('#confirmRemoveWordModal').modal('hide')
                    word.classList.add('hidden')
                })
                return
            }
            // Update Word
            let currentWord = findWordById(id)
            let initWord = currentWord.word
            let initMeaning = currentWord.meaning
            const markup = `
            <tr>
                <td>
                    <div class="form-group mb-0">
                        <input type="text" id= "inputEditWord" class="form-control" 
                            autocomplete="off" aria-describedby="inputEditWordHelp"
                            value="${initWord}" >
                        <div class="invalid-feedback">
                            Từ này đã tồn tại.
                        </div>
                        <small id="inputEditWordHelp" class="form-text text-danger">
                        </small>
                    </div>
                </td>
                <td>
                    <div class="form-group mb-0">
                        <textarea id= "inputEditMeaning" class="form-control" 
                            autocomplete="off" aria-describedby="inputEditMeaningHelp"
                            >${initMeaning}</textarea>
                        <div class="invalid-feedback">
                            Tối đa 50 ký tự.
                        </div>
                        <small id="inputEditMeaningHelp" class="form-text text-danger">
                        </small>
                    </div>
                </td>
                <td>
                    <button class="btn btn-outline-info js-btn-confirm-edit-word">Lưu</button>
                </td>
            </tr>
            `
            word.outerHTML = markup

            const inputEditWord = document.querySelector('#inputEditWord')
            const inputEditMeaning = document.querySelector('#inputEditMeaning')
            inputEditWord.setSelectionRange(initWord.length, initWord.length)
            inputEditWord.focus()
            inputEditWord.classList.add('is-valid')
            inputEditMeaning.classList.add('is-valid')

            inputEditWord.addEventListener('input', (e) => {
                e.target.value = e.target.value.toLowerCase()
                const newWord = e.target.value.trim()
                if (!newWord) {
                    document.querySelector('#inputEditWordHelp').textContent = 'Trường này không được để trống.'
                    inputEditWord.classList.remove('is-valid')
                    return
                }
                document.querySelector('#inputEditWordHelp').textContent = ''
                if (newWord !== initWord && !isWordUnique(newWord, g_listWord)) {
                    inputEditWord.classList.remove('is-valid')
                    inputEditWord.classList.add('is-invalid')
                    return
                }
                inputEditWord.classList.remove('is-invalid')
                inputEditWord.classList.add('is-valid')
            })
            inputEditWord.addEventListener('keypress', (e) => {
                if (e.key === "Enter") {
                    inputEditMeaning.setSelectionRange(initMeaning.length, initMeaning.length)
                    inputEditMeaning.focus()
                }
            })

            inputEditMeaning.addEventListener('input', (e) => {
                const newMeaning = e.target.value.trim()
                if (!newMeaning) {
                    document.querySelector('#inputEditMeaningHelp').textContent = 'Trường này không được để trống.'
                    inputEditMeaning.classList.remove('is-valid')
                    return
                }
                document.querySelector('#inputEditMeaningHelp').textContent = ''
                if (!existMaxChar(newMeaning, 50)) {
                    inputEditMeaning.classList.remove('is-valid')
                    inputEditMeaning.classList.add('is-invalid')
                    return
                }
                inputEditMeaning.classList.remove('is-invalid')
                inputEditMeaning.classList.add('is-valid')
            })

            document.querySelector('.js-btn-confirm-edit-word').addEventListener('click', async () => {
                if (inputEditWord.classList.contains('is-valid') && (inputEditMeaning.classList.contains('is-valid'))) {
                    await updateWordToLocalStorage({ word: inputEditWord.value.trim(), meaning: inputEditMeaning.value.trim() }, id)
                    renderSearchListWordTable()
                    return
                }
                // thông báo Cập nhật thất bại
                renderListWordTable()
                return
            })
            const anotherWord = document.querySelectorAll(`.js-list-word-table tbody tr[id]`)
            for (let word2 of anotherWord) {
                word2.addEventListener('click', () => {
                    renderSearchListWordTable()
                    return
                })
            }


            // document.addEventListener('click', (e) => {
            //     const targetEl = e.target.closest(`.js-list-word-table tbody tr[id="${id}"]`)
            //     if (!targetEl) {
            //         ren
            //     }
            //     if (inputEditWord.classList.contains('is-valid') && (inputEditMeaning.classList.contains('is-valid'))) {
            //         // updateWordToLocalStorage({ word: inputEditMeaning.value.trim(), meaning: inputEditMeaning.value.trim() }, id)
            //         // renderSearchListWordTable()
            //         console.log("OK")
            //         return
            //     }
            //     console.log("Hủy update")
            //     // renderSearchListWordTable()
            //     return
            // })
        })
    }
}

// --------------------------- INIT -------------------------
const init = async () => {
    await getUserFromLocalStorage()
    if (!g_user) {
        renderLoginClick()
    } else {
        renderUserDisplay()
    }
    // await getListWord()   
}
init()