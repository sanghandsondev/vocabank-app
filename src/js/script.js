import 'core-js/stable'                     // polyfilling everything else
import '@babel/polyfill'
// import 'regenerator-runtime/runtime'        // polyfilling async/await
import { RESULT_PER_PAGE } from './config'
import { isEmail, isWordUnique, existMaxChar } from './utils'
import { login, logout } from './auth'
import { showToast, setTimeDisplay } from './custom'
import { async } from 'regenerator-runtime'

// const app = document.querySelector('.js-app')
const headerEl = document.querySelector('.js-header')
const contentEl = document.querySelector('.js-content')
const mainEl = document.querySelector('.js-main')
const accountEl = document.querySelector('.js-account')
const userEl = document.querySelector('.js-user')

// Người dùng, từ của ng dùng, các trò chơi => database => admin page
// LOCAL MODAL STATE
let g_listWord = []
let g_user
let g_listStoryPlay = []

let g_numberWordComplete

let g_timeTest
let g_timeSuggest
let g_timeLive
let g_timeOut

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

const getListHistoryPlayFromLocalStorage = async () => {

    const list = await localStorage.getItem('history')
    if (!list) return
    g_listStoryPlay = JSON.parse(list)
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

// ---- Custom Data -----
const resultSearchListWord = (input) => {
    return g_listWord.filter((el) => {
        return el.word.startsWith(input) === true
    })
}


// Word Data
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

// History Play Data
const persistListHistory = () => {
    localStorage.setItem('history', JSON.stringify(g_listStoryPlay))
}

const addNewHistoryPlay = (data) => {
    data.dateCompleted = new Date().toLocaleString("en-US")
    g_listStoryPlay.push(data)
    persistListHistory()
}

const clearListHistoryLocalStorage = () => {
    g_listStoryPlay = []
    localStorage.removeItem('history')
}


// ----------------------- RENDER VIEW-----------------------------
const renderInitPage = async () => {
    clear(mainEl)
    renderSpinner(mainEl)
    await renderView(mainEl, initpageMarkup())
    // add handler
    addHandlerClickOptionGame()
}

const renderGame1 = async () => {
    clear(mainEl)
    renderSpinner(mainEl)
    await renderView(mainEl, game1Markup())
    // add handler here for game 1 view
    addHandlerFocusTimeTestInput()
    addHandlerSubmitTimeTestForm()
}

const renderGame1Content = async () => {
    const contentEl = document.querySelector('.js-game1-content')
    clear(contentEl)
    renderSpinner(contentEl)
    await renderView(contentEl, game1ContentMarkup(g_listWord))
    //add handler
    addHandlerInputWordGame1()
    addHandlerSubmitCheckAnswerForm()
    addHandlerSuggestFirstChar()
    addHandlerSuggestWord()
}

const renderOptionLogin = async () => {
    clear(accountEl)
    renderSpinner(accountEl)
    await renderView(accountEl, optionLoginMarkup())
    // add handler
    addHandlerRenderOptionLogin()
    addHandlerRenderSignup()
}

const renderLoginWithEmail = async () => {
    clear(accountEl)
    renderSpinner(accountEl)
    await renderView(accountEl, formLoginWithEmailMarkup())
    // add handler
    addHandlerSubmitLogin()
}

const renderSignup = async () => {
    clear(accountEl)
    renderSpinner(accountEl)
    await renderView(accountEl, formSignUpMarkup())
    // add handler
}

const renderUserDisplay = async () => {
    clear(userEl)
    await renderView(userEl, userDisplayMarkup())
    // add handler
    addHandlerLogOut()
    addHandlerRenderListHistoryPlay()
    addHandlerRenderListWordTable()
    addHandlerRenderAdminPage()
}

const renderLoginClick = async () => {
    clear(userEl)
    await renderView(userEl, loginClickMarkup())
    //add handler
    addHandlerClickLogIn()
}

const renderListWordTable = async () => {
    // LOAD LẦN ĐẦU THÔI
    clear(accountEl)
    renderSpinner(accountEl)
    await getListWordFromLocalStorage()   // LOAD data lần đầu vs API
    await renderView(accountEl, listWordTableMarkup(g_listWord))
    // add handler
    addHandlerRenderAddWordInput()
    addHandlerInputSearchWord()
    addHandlerRenderEditWordInput()
    addHandlerPaginatePage()  // OK
}

// LƯU Ý: render bảng word phụ thuộc vào data-index của paginationEl
const renderSearchListWordTable = async () => {
    const listword = document.querySelector('.js-list-word-table')
    const inputSearch = document.querySelector('#inputSearchWord')
    clear(listword)
    renderSpinner(listword)
    await renderView(listword, updateListWordMarkup(resultSearchListWord(inputSearch.value)))
    renderUpdatePagination()
    // add handler
    addHandlerRenderEditWordInput()
}

const renderUpdatePagination = () => {
    const paginationEl = document.querySelector('.js-pagination-list-word')
    const inputSearch = document.querySelector('#inputSearchWord')
    clear(paginationEl)
    renderSpinner(paginationEl)
    renderView(paginationEl, updatePaginationMarkup(resultSearchListWord(inputSearch.value)))
    // add handler
}

const renderListHistoryPlay = async () => {
    clear(accountEl)
    renderSpinner(accountEl)
    await getListHistoryPlayFromLocalStorage()
    await renderView(accountEl, listHistoryPlayMarkup(g_listStoryPlay))
    // add handler
    addHandlerRenderAllHistory()
}

const renderAllHistory = async () => {
    clear(mainEl)
    renderSpinner(mainEl)
    await renderView(mainEl, allHistoryPlayMarkup(g_listStoryPlay))
    // add handler
}

//--------------Admin ----------------------
const renderInitAdminPage = () => {
    // clear(headerEl)
    clear(contentEl)
    clear(userEl)
    renderView(contentEl, adminPageInitMarkup())
    // Add handler
}

//------------------------ MARKUP -------------------------------
const initpageMarkup = () => {
    return `
    <div class="row">
        <div class="col-xl-12 col-sm-12 col-lg-12">
            <div class="card">
                <div class="js-game-1">
                    <div class="game-intro card-body">
                        <h5 class="card-title">
                            Trò chơi 1
                            <span class="badge badge-pill badge-danger">Khó</span>
                        </h5>
                        <p class="card-text">
                            Trò chơi giống như một bài kiểm tra trắc luận. Bạn sẽ nhập số lượt từ bạn muốn kiểm tra. 
                            Sẽ có thời gian và gợi ý cho bạn để hoàn thành trò chơi. 
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-12 col-sm-12 col-lg-12">
            <div class="card mt-3">
                <div class="js-game-2">
                    <div class="game-intro card-body">
                        <h5 class="card-title">
                            Trò chơi 2
                            <span class="badge badge-pill badge-primary">Đang cập nhật</span>
                        </h5>
                        <p class="card-text">
                            Trò chơi giống như một bài kiểm tra trắc nghiệm. Bạn sẽ nhập số lượt từ bạn muốn kiểm tra. 
                            Sẽ chỉ có thời gian đếm ngược và không có gợi ý dành cho bạn trong quá trình thực hiện.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}

const game1Markup = () => {

    // g_timeSuggest = TIME_SUGGEST_GAME_1
    // g_timeLive = TIME_LIVE_GAME_1
    return `
        <h3 >Trò chơi 1 </h3>
        <button type="button" class="btn btn-primary js-btn-start-game" data-toggle="modal" data-target="#timeTestModal">
            Bắt đầu trò chơi
        </button>
        
        <div class="js-time-game1 hidden"> 
            <button type="button" class="btn btn-outline-primary js-time-test-display" disabled>
                Luợt kiểm tra:
                <span class=" font-weight-bold"></span>
            </button>

            <button type="button" class="btn btn-outline-primary ml-5 js-time-suggest-display" disabled>
                Lượt gợi ý còn lại:
                <span class=" font-weight-bold"></span>
            </button>

            <button type="button" class="btn btn-outline-primary ml-5 js-time-live-display" disabled>
                Số mạng còn lại của bạn:
                <span class=" font-weight-bold"></span>
            </button>
            <button type="button" class="btn btn-info btn-lg ml-5 js-time-out-display" disabled>
                <span class="js-hour-display"></span>
                :
                <span class="js-minute-display"></span>
                :
                <span class="js-second-display"></span>
                
            </button>
        </div>
        <div class="js-game1-content">
            
        </div>

    `
}

const game1ContentMarkup = (list) => {
    const length = list.length
    const random = Math.floor(Math.random() * length)
    return `
        <form class="js-form-check-answer-game1">
            <div class="form-group">
                <label for="inputWordGame1">Từ</label>
                <input type="text" class="form-control" id="inputWordGame1" placeholder="Nhập từ..." autocomplete="off">
                <div class="invalid-feedback">
                    Đáp án không đúng.
                </div>
                
            </div>
            <div class="form-group">
                <label for="inputMeaningGame1">Nghĩa</label>
                <input type="text" class="form-control" id="inputMeaningGame1" disabled value="${list[random].meaning}">
            </div>
            <button id="${random}" type="submit" class="btn btn-primary js-btn-check-answer">Kiểm tra đáp án</button>
        </form>

        <button type="button" class="btn btn-outline-info mt-3 
            js-btn-suggest-first-char" data-index=${random}>
            Gợi ý chữ cái đầu
        </button>
        <button type="button" class="btn btn-outline-info ml-3 mt-3 
            js-btn-suggest" data-index=${random}>
            Gợi ý từ
        </button>
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
    const linkAdminPage = g_user.rule === "admin" ? `<a class="dropdown-item js-user-admin-page" href="#admin123123123">Trang Admin</a>` : ''
    return `
    <li class="nav-item dropdown mr-5">
        <a class="nav-link dropdown-toggle text-light" href="#" id="navbarDropdown" role="button"
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            ${g_user.username}
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item js-user-info" href="#">Trang cá nhân</a>
            <a class="dropdown-item js-user-history-play" href="#">Lịch sử chơi</a>
            <a class="dropdown-item js-user-vocab" href="#">Quản lý từ vựng</a>
            ${linkAdminPage}
            <div class="dropdown-divider"></div>
            <a class="dropdown-item js-logout" href="#">Đăng xuất</a>
        </div>
    </li>
    `
}

const listWordTableMarkup = (list) => {
    let markupPagi
    const numPages = Math.ceil(list.length / RESULT_PER_PAGE)

    list = list.slice(0, RESULT_PER_PAGE)

    const markupList = list.map((el, index) => {

        return `
        <tr id="${el.id}">
            <td>    
                ${el.word}
            </td>
            <td class="fix-line-css">
                ${el.meaning}
            
            </td>
            <td>
                <button type="button" class="btn btn-outline-danger btn-sm js-btn-remove-word"
                    data-toggle="modal" data-target="#confirmRemoveWordModal">Xóa</button>
            </td>
        </tr>  
        `
    }).join('')

    if (numPages > 1) {
        markupPagi = `
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item disabled">
                    <a class="page-link" href="#">
                        Trước
                    </a>
                </li>
                <li class="page-item"><a class="page-link" href="#">1</a></li>
                <li class="page-item js-btn-inline" data-goto=2>
                    <a class="page-link" href="#"  >
                        Sau
                    </a>
                </li>
            </ul>
        </nav>
        `
    }
    if (numPages <= 1) {
        markupPagi = `
        
        `
    }

    return `
    <div class="input-group mb-3">
        <input type="text" class="form-control" id="inputSearchWord" autocomplete="off" placeholder="Nhập tìm kiếm từ..." aria-label="Recipient's username" >
        <div class="input-group-append">
            <button type="button" class="btn btn-outline-info js-btn-add-word">Thêm</button>
        </div>
    </div>
    

    <table class="table table-sm  table-striped js-list-word-table">
        <thead>
            <tr>
                <th scope="col">Từ</th>
                <th scope="col">Nghĩa</th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
            ${markupList}
        </tbody>
    </table>

    <div class="js-pagination-list-word" data-index=1>
        ${markupPagi}
    </div>
    `
}

const updateListWordMarkup = (list) => {
    const currentPage = document.querySelector('.js-pagination-list-word').dataset.index
    const start = (currentPage - 1) * RESULT_PER_PAGE
    const end = currentPage * RESULT_PER_PAGE
    list = list.slice(start, end)
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
            <td>    
                ${el.word}
            </td>
            <td class="fix-line-css">
            ${el.meaning}
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

const updatePaginationMarkup = (list) => {
    let currentPage = Number(document.querySelector('.js-pagination-list-word').dataset.index)
    let numPages = Math.ceil(list.length / RESULT_PER_PAGE)

    // Page 1, and there are other  pages
    if (currentPage === 1 && numPages > 1) {
        return `
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item disabled">
                    <a class="page-link" href="#"  >
                        Trước
                    </a>
                </li>
                <li class="page-item"><a class="page-link" href="#">${currentPage}</a></li>
                <li class="page-item js-btn-inline" data-goto=${currentPage + 1}>
                    <a class="page-link" href="#"  >
                        Sau
                    </a>
                </li>
            </ul>
        </nav>
        `
    }
    // Last page
    if (currentPage === numPages && numPages > 1) {
        return `
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item js-btn-inline" data-goto=${currentPage - 1}>
                    <a class="page-link" href="#">
                        Trước
                    </a>
                </li>
                <li class="page-item"><a class="page-link" href="#">${currentPage}</a></li>
                <li class="page-item disabled">
                    <a class="page-link" href="#">
                        Sau
                    </a>
                </li>
            </ul>
        </nav>
        `
    }
    // Other page
    if (currentPage < numPages) {
        return `
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item js-btn-inline" data-goto=${currentPage - 1}>
                    <a class="page-link" href="#" >
                        Trước
                    </a>
                </li>
                <li class="page-item"><a class="page-link" href="#">${currentPage}</a></li>
                <li class="page-item js-btn-inline" data-goto=${currentPage + 1}>
                    <a class="page-link" href="#"  >
                        Sau
                    </a>
                </li>
            </ul>
        </nav>
        `
    }
    // Page 1, and there are NO other pages
    return ''
}

const listHistoryPlayMarkup = (list) => {
    const length = list.length
    let derseList = []
    let markupMore = length > RESULT_PER_PAGE ? `<button class="btn btn-outline-info btn-sm js-btn-more-history">Xem tất cả ...</button>` : ''
    for (let i = length - 1; i >= length - RESULT_PER_PAGE; i--) {
        if (i < 0) break
        derseList.push(list[i])
    }
    const markupList = derseList.map((el) => {
        return `
            <tr>
                <td class="text-${el.difficulty}">${el.title}</td>
                <td class="text-center">${el.timeTest}</td>
                <td>${el.dateCompleted}</td>
            </tr>
        `
    }).join('')
    return `
        <table class="table  js-list-history-table">
            <thead>
                <tr>
                    <th scope="col">Trò chơi</th>
                    <th scope="col">Từ kiểm tra</th>
                    <th scope="col">Ngày hoàn thành</th>
                </tr>
            </thead>
            <tbody>
                ${markupList}
            </tbody>
        </table>
        ${markupMore}
    `
}

const allHistoryPlayMarkup = (list) => {
    const length = list.length
    const derseList = list.map((el, index) => {
        return list[length - 1 - index]
    })
    const markupList = derseList.map((el, index) => {
        return `
        <tr>
            <td class="text-${el.difficulty} text-center">${el.title}</td>
            <td class="text-center">${el.timeTest}</td>
            <td class="text-center">${el.dateCompleted}</td>
        </tr>
        `
    }).join('')
    return `
        <table class="table table-sm js-all-history-table">
            <thead>
                <tr>
                    <th class="text-center" scope="col">Trò chơi</th>
                    <th  class="text-center" scope="col">Từ kiểm tra</th>
                    <th class="text-center" scope="col">Ngày hoàn thành</th>
                </tr>
            </thead>
            <tbody>
                ${markupList}
            </tbody>
        </table>
    `

}

// ---- Admin ----
const adminPageInitMarkup = () => {
    return `
        <div class="row">
            <nav class="col-md-2 d-none d-md-block bg-transparent sidebar border js-sidebar">
                <div class="sidebar-sticky">
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link text-primary mt-2" href="#">Customers</a>  
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-dark mt-2" href="#">Games</a>  
                        </li>
                    </ul>
            </nav>
            <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4 bg-light js-main-admin">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">Dashboard</h1>
                    <div class="btn-toolbar mb-2 mb-md-0">
                    <div class="btn-group mr-2">
                        <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
                        <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        This week
                    </button>
                    </div>
                </div>

                <h2>Customers</h2>
                <div class="table-responsive">
                    <table class="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>12345678910</td>
                            <td>sangank@gmail.com</td>
                            <td>Hoàng Trung Sang</td>
                            <td>online</td>
                            <td>Chi tiết</td>
                        </tr>
                        <tr>
                            <td>12345678910</td>
                            <td>sangank@gmail.com</td>
                            <td>Hoàng Trung Sang</td>
                            <td>offline 1 minute ago</td>
                            <td>Chi tiết</td>
                        </tr>
                        <tr>
                            <td>12345678910</td>
                            <td>sangank@gmail.com</td>
                            <td>Hoàng Trung Sang</td>
                            <td>offline 3minutes ago</td>
                            <td>Chi tiết</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                </main>
            </div>
    `
}

// ------------------------- ADD HANDLER -------------------------------
// Init Page Load

const addHandlerClickOptionGame = async () => {
    const btnGame1 = document.querySelector('.js-game-1')
    const btnGame2 = document.querySelector('.js-game-2')
    btnGame1.addEventListener('click', async () => {
        if (!g_user) {
            showToast('Bạn cần đăng nhập để tiếp tục', 'warning')
            return
        }
        await getListHistoryPlayFromLocalStorage()
        await getListWordFromLocalStorage()
        if (g_listWord.length < 10) {
            showToast('Bảng từ vựng cần tối thiểu 10 từ để tham gia trò chơi.', 'warning')
            return
        }
        renderGame1()
        clear(accountEl)
        clear(userEl)
    })

    btnGame2.addEventListener('click', async () => {
        if (!g_user) {
            showToast('Bạn cần đăng nhập để tiếp tục', 'warning')
            return
        }
        await getListHistoryPlayFromLocalStorage()
        await getListWordFromLocalStorage()

        if (g_listWord.length < 10) {
            showToast('Bảng từ vựng cần tối thiểu 10 từ để tham gia trò chơi.', 'warning')
            return
        }
        showToast('Trò chơi đang trong giai đoạn phát triển. Vui lòng thử lại sau.', 'info')
        // renderGame2()
    })
}


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
        if (timeTest > 360) {
            document.querySelector('#timeTestHelp').textContent = `Tối đa 360 lượt.`
            return false
        }
        g_numberWordComplete = timeTest
        g_timeTest = timeTest
        g_timeSuggest = Number.parseInt(timeTest / 7)
        g_timeLive = Number.parseInt(timeTest / 4) + 1
        g_timeOut = (timeTest * 20 * 1000)
        const btnTimeOutDisplay = document.querySelector('.js-time-out-display')
        setTimeDisplay(g_timeOut)
        const myTimer = setInterval(() => {
            setTimeDisplay(g_timeOut)

            if (g_timeOut === 180000) {
                btnTimeOutDisplay.classList.remove('btn-info')
                btnTimeOutDisplay.classList.add('btn-warning')
            }
            if (g_timeOut === 60000) {
                btnTimeOutDisplay.classList.remove('btn-info')
                btnTimeOutDisplay.classList.remove('btn-warning')
                btnTimeOutDisplay.classList.add('btn-danger')
            }
            if (g_timeOut === 0) {
                // resetLocalGameState()
                clearInterval(myTimer)
                showToast('Hết thời gian. Rất tiếc bạn đã không hoàn thành trò chơi.', 'danger')
                setTimeout(() => {
                    location.assign('/')
                }, 4000)
            }
            g_timeOut -= 1000
        }, 1000)
        // clear interval
        // const stopTimer = clearInterval(myTimer)

        $('#timeTestModal').modal('hide')
        document.querySelector('.js-time-game1').classList.remove('hidden')
        document.querySelector('.js-btn-start-game').classList.add('hidden')
        document.querySelector('.js-time-test-display span').textContent = g_timeTest
        document.querySelector('.js-time-suggest-display span').textContent = g_timeSuggest
        document.querySelector('.js-time-live-display span').textContent = g_timeLive
        renderGame1Content()
        document.querySelector('#inputWordGame1').focus()
    })
}

const addHandlerInputWordGame1 = () => {
    document.querySelector('#inputWordGame1').addEventListener('input', (e) => {
        e.target.classList.remove('is-invalid')
    })
}

const addHandlerSubmitCheckAnswerForm = () => {
    document.querySelector('.js-form-check-answer-game1').addEventListener('submit', (e) => {
        e.preventDefault()
        const index = document.querySelector('.js-btn-check-answer').getAttribute('id')
        // console.log(index)
        const inputWord = document.querySelector('#inputWordGame1')
        const timeTestDisplay = document.querySelector('.js-time-test-display')
        const timeLiveDisplay = document.querySelector('.js-time-live-display')
        const timeSuggestDisplay = document.querySelector('.js-time-suggest-display')
        const meaning = g_listWord[index].meaning
        const listAnswer = g_listWord.filter((el) => {
            return el.meaning === meaning
        })
        const checkAns = listAnswer.some((el) => {
            return el.word === inputWord.value.trim()
        })

        if (!checkAns) {
            // Wrong answer
            inputWord.classList.add('is-invalid')
            g_timeLive--
            document.querySelector('.js-time-live-display span').innerText = g_timeLive
            timeTestDisplay.classList.remove('btn-success')
            timeTestDisplay.classList.add('btn-outline-primary')
            timeLiveDisplay.classList.remove('btn-outline-primary')
            timeLiveDisplay.classList.add('btn-danger')
            if (g_timeLive === 0 || g_timeLive < 0) {
                // Show Modal 
                // resetLocalGameState()
                showToast('Rất tiếc bạn đã không hoàn thành trò chơi.', 'danger')
                setTimeout(() => {
                    location.assign('/')
                }, 2000)
                // renderInitPage()
                return
            }
            inputWord.focus()
            return
        }
        // Right answer
        g_timeTest--
        if (g_timeTest === 0) {
            // Complete Game 
            showToast('Chúc mừng bạn đã hoàn thành xuất sắc trò chơi. Vui lòng vào Trang cá nhân để lấy phần thưởng!', 'info')
            addNewHistoryPlay({ title: 'Trò chơi 1', difficulty: 'danger', timeTest: g_numberWordComplete })
            setTimeout(() => {
                location.assign('/')

            }, 2000)
            // renderInitPage()
            return
        }
        timeTestDisplay.classList.remove('btn-outline-primary')
        timeTestDisplay.classList.add('btn-success')
        timeLiveDisplay.classList.remove('btn-danger')
        timeLiveDisplay.classList.add('btn-outline-primary')
        timeSuggestDisplay.classList.remove('btn-warning')
        timeSuggestDisplay.classList.add('btn-outline-primary')
        document.querySelector('.js-time-test-display span').innerText = g_timeTest
        //reset
        renderGame1Content()
        document.querySelector('#inputWordGame1').focus()
    })
}

const addHandlerSuggestFirstChar = () => {
    document.querySelector('.js-btn-suggest-first-char').addEventListener('click', (e) => {
        const btn = e.target
        if (!btn) return
        const index = btn.dataset.index
        const meaning = g_listWord[index].meaning
        const listSuggest = g_listWord.filter((el) => {
            return el.meaning === meaning
        })
        const firstCharSug = listSuggest.map((el) => {
            return el.word.charAt(0)
        })
        const random = Math.floor(Math.random() * firstCharSug.length)
        document.querySelector('#inputWordGame1').value = firstCharSug[random]
        document.querySelector('#inputWordGame1').focus()
    })
}

const addHandlerSuggestWord = () => {
    document.querySelector('.js-btn-suggest').addEventListener('click', (e) => {
        const btn = e.target
        if (!btn) return
        const index = btn.dataset.index
        if (g_timeSuggest === 0) {
            showToast('Bạn đã dùng hết sự trợ giúp.', 'warning')
            return
        }
        const meaning = g_listWord[index].meaning
        const listSuggest = g_listWord.filter((el) => {
            return el.meaning === meaning
        })
        btn.setAttribute('disabled', '')
        btn.innerHTML = listSuggest.map((el) => {
            return `${el.word}`
        }).join(' / ')
        g_timeSuggest--
        document.querySelector('.js-time-suggest-display span').innerText = g_timeSuggest
        document.querySelector('.js-time-suggest-display').classList.remove('btn-outline-primary')
        document.querySelector('.js-time-suggest-display').classList.add('btn-warning')
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
        const email = document.querySelector('#inputLoginEmail').value.trim()
        const password = document.querySelector('#inputLoginPassWord').value.trim()
        await login({ email, password })
        // await getUserFromLocalStorage()
        // showToast('Đăng nhập thành công.', 'success')
        // renderUserDisplay()
        // renderListHistoryPlay()
    })
}

const addHandlerLogOut = () => {
    document.querySelector('.js-logout').addEventListener('click', (e) => {
        logout()
        // g_user = {}
        getUserFromLocalStorage()
        g_listWord = []
        showToast('Bạn đã đăng xuất', 'info')
        renderLoginClick()
        renderOptionLogin()
        renderInitPage()
    })
}

const addHandlerRenderListWordTable = () => {
    document.querySelector('.js-user-vocab').addEventListener('click', () => {
        renderListWordTable()
    })
}

const addHandlerRenderAdminPage = () => {
    window.addEventListener('hashchange', () => {
        if (location.hash.slice(1) === "admin123123123") {
            renderInitAdminPage()
        }
    })
}

const addHandlerRenderListHistoryPlay = () => {
    document.querySelector('.js-user-history-play').addEventListener('click', () => {
        renderListHistoryPlay()
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
            // tbody.removeChild(tbody.querySelector(':first-child'))
            document.querySelector('#inputSearchWord').removeAttribute('disabled')
            renderSearchListWordTable()
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
            <td>${newWord.word}</td>
            <td>${newWord.meaning = newWord.meaning.length > 20 ? newWord.meaning.slice(0, 20) + "..." : newWord.meaning}</td>
            <td>
                <button type="button" class="btn btn-outline-success btn-sm disabled">New</button>
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
        document.querySelector('.js-pagination-list-word').setAttribute('data-index', 1)
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
                    renderSearchListWordTable()
                    // word.classList.add('hidden')
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
                            rows=3>${initMeaning}</textarea>
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
            // word.outerHTML = markup
            const newMarkup = document.createElement('tr')
            newMarkup.innerHTML = markup
            word.parentElement.replaceChild(newMarkup, word)
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
            // console.log(inputEditWord, inputEditMeaning)

            document.querySelector('.js-btn-confirm-edit-word').addEventListener('click', async () => {
                const variWord = inputEditWord.value.trim()
                const variMeaning = inputEditMeaning.value.trim()
                if (inputEditWord.classList.contains('is-valid') && (inputEditMeaning.classList.contains('is-valid'))) {
                    await updateWordToLocalStorage({ word: variWord, meaning: variMeaning }, id)
                    showToast('Cập nhật thành công.', 'success')
                    renderSearchListWordTable()
                    return
                }
                // thông báo Cập nhật thất bại
                showToast('Cập nhật thất bại.', 'danger')
                renderSearchListWordTable()
                // newMarkup.parentElement.replaceChild(word, newMarkup)
                return
            })
            const anotherWord = document.querySelectorAll(`.js-list-word-table tbody tr[id]`)
            for (let word2 of anotherWord) {
                word2.addEventListener('click', async (e) => {
                    showToast('Cập nhật thất bại.', 'warning')
                    renderSearchListWordTable()
                    return
                })
            }
        })
    }
}

const addHandlerPaginatePage = () => {
    document.querySelector('.js-pagination-list-word').addEventListener('click', (e) => {
        let btn = (e.target.closest('.js-btn-inline'))
        if (!btn) return
        let goToPage = btn.dataset.goto
        document.querySelector('.js-pagination-list-word').removeAttribute('data-index')
        document.querySelector('.js-pagination-list-word').setAttribute('data-index', goToPage)
        renderUpdatePagination()
        renderSearchListWordTable()
    })
}

const addHandlerRenderAllHistory = () => {
    const btn = document.querySelector('.js-btn-more-history')
    if (btn) {
        btn.addEventListener('click', () => {
            renderAllHistory()
            clear(accountEl)
        })
    }

}

// All history play table


// --------------------------- INIT -------------------------
const init = async () => {
    await getUserFromLocalStorage()
    if (!g_user) {
        renderLoginClick()
    } else {
        renderUserDisplay()
    }
    renderInitPage()
    // await getListWord()   
}
init()