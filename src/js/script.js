import 'core-js/stable'                     // polyfilling everything else
import '@babel/polyfill'
// import 'regenerator-runtime/runtime'        // polyfilling async/await
import { TIME_LIVE_GAME_1, TIME_SUGGEST_GAME_1 } from './config'
import { isEmail, isWordUnique, existMaxChar } from './utils'
import { login, logout } from './auth'

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

const persistListWordLocalStorage = () => {
    localStorage.setItem('listword', JSON.stringify(g_listWord))
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

// HANDLE EVENT - Initial Load

if (btnGame1) {
    btnGame1.addEventListener('click', () => {
        renderGame1()
    })
}



// RENDER VIEW

const renderGame1 = () => {
    clear(mainEl)
    renderSpinner(mainEl)
    renderView(mainEl, game1Markup())
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
    await renderView(accountEl, listWordTableMarkup(g_listWord))
    // add handler
    addHandlerRenderAddWordInput()
}

// MARKUP
const game1Markup = () => {
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
                <span class="text-dark">${TIME_SUGGEST_GAME_1}</span>
            </button>

            <button type="button" class="btn btn-outline-primary ml-5 js-time-suggest-display" disabled>
                Số mạng còn lại của bạn:
                <span class="text-dark">${TIME_LIVE_GAME_1}</span>
            </button>

            <form class="js-form-check-answer mt-3">
                <div class="form-group">
                    <label for="inputWordGame1">Từ</label>
                    <input type="text" class="form-control" id="inputWordGame1" placeholder="Nhập từ..." autocomplete="off">
                </div>
                <div class="form-group">
                    <label for="inputMeaningGame1">Nghĩa</label>
                    <input type="text" class="form-control" id="inputMeaningGame1" disabled value="bố và mẹ">
                </div>
                <button type="submit" class="btn btn-primary">Kiểm tra đáp án</button>
            </form>
            
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
        <tr>
            <th scope="row">${el.word}</th>
            <td>${el.meaning}</td>
            <td></td>
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
// ADD HANDLER
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
                    <input type="text" id= "inputAddMeaning" class="form-control" 
                        autocomplete="off" aria-describedby="inputAddMeaningHelp">
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
        //     < input type = "text" class="form-control" id = "inputTimeTest"
        // aria - describedby="timeTestHelp" placeholder = "Enter a positive integer number..."
        // autocomplete = "off" >
        //     <small id="timeTestHelp" class="form-text text-danger"></small>
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
        addHandlerAddWord()
    })

}

const addHandlerAddWord = () => {
    const handleAddWordSuccess = (data) => {
        document.querySelector('#inputAddWord').value = ''
        document.querySelector('#inputAddWord').focus()
        document.querySelector('#inputAddMeaning').value = ''
        document.querySelector('#inputAddWordHelp').textContent = ''
        document.querySelector('#inputAddMeaningHelp').textContent = ''
        document.querySelector('#inputAddWord').classList.remove('is-invalid')
        document.querySelector('#inputAddMeaning').classList.remove('is-invalid')
        const markup = `
        <tr>
            <th scope="row">${data.word}</th>
            <td>${data.meaning}</td>
            <td></td>
        </tr>
        `
        document.querySelector('.js-list-word-table tbody').insertAdjacentHTML('beforeend', markup)
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
}

// const addHandlerInputSearchWord = () => {
//     document.querySelector('#inputSearchWord').addEventListener('input', (e) => {
//         renderListWordTable()
//     })
// }

// INIT
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
localStorage.removeItem('items')