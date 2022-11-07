// import 'core-js/stable'                     // polyfilling everything else
// import '@babel/polyfill'
import { RESULT_PER_PAGE, SECOND_PER_TEST } from './config'
import { isEmail, isWordUnique, existMaxChar, isEqual, existMinChar } from './utils'
import { login, logout, signup, updatePassword } from './auth'
import { showToast, setTimeDisplay, readImg, addNoteWordInGame } from './custom'
import { async } from 'regenerator-runtime'
import GameMarkup from './views/gameView'
import AuthMarkup from './views/authView'
import AccountMarkup from './views/accountView'
import AdminMarkup from './views/adminView'
import MainMarkup from './views/mainView'
import { updateInfoCurrentUser, getAllWordByCurrentUser, getAllGames, addWord, removeWord, updateWord, addHistory, getHistoryOfCurrentUser } from './data'

// const app = document.querySelector('.js-app')
const headerEl = document.querySelector('.js-header')
const contentEl = document.querySelector('.js-content')
const mainEl = document.querySelector('.js-main')
const accountEl = document.querySelector('.js-account')
const userEl = document.querySelector('.js-user')

// LOCAL MODAL STATE
let g_user
let g_listWord
let g_listHistoryPlay
let g_listGame

let g_gameId
let g_numberWordComplete

let g_timeTest
let g_timeSuggest
let g_timeLive
let g_timeOut

const getListGame = async () => {
    try {
        if (g_listGame) return
        const data = await getAllGames()
        if (!data) return
        g_listGame = data
    } catch (err) {
        showToast(err, 'danger')
    }
}

const getListWord = async () => {
    try {
        const data = await getAllWordByCurrentUser()
        if (!data) return
        g_listWord = data
    } catch (err) {
        showToast(err, 'danger')
    }
}

const getUserFromLocalStorage = async () => {
    if (!document.cookie) {
        localStorage.removeItem('user')
    }
    const user = await localStorage.getItem('user')
    if (!user) g_user = undefined
    g_user = JSON.parse(user)
}

const getListHistoryOfCurrentUser = async () => {
    try {
        if (g_listHistoryPlay) return
        const data = await getHistoryOfCurrentUser()
        if (!data) return
        const length = data.length
        let list = []
        for (let i = length - 1; i >= 0; i--) {
            list.push(data[i])
        }
        g_listHistoryPlay = list
    }
    catch (err) {
        showToast(err, 'danger')
    }
}

// ---- Custom Data -----
// OK
const resultSearchListWord = (input) => {
    return g_listWord.filter((el) => {
        return el.name.startsWith(input) === true
    })
}
// OK
const findWordById = (id) => {
    return g_listWord.find((el) => {
        return el._id == id
    })
}
// OK
const removeWordNow = async (id) => {
    try {
        await removeWord(id)
        // console.log('OK')
        const word = findWordById(id)
        if (!word) return
        const index = g_listWord.indexOf(word)
        g_listWord.splice(index, 1)
    } catch (err) {
        // showToast(err, 'danger')
        console.log()
    }
}
// OK
const updateWordNow = async (data, id) => {
    try {
        await updateWord(data, id)
        showToast('Cập nhật thành công.', 'success')
        const word = findWordById(id)
        if (!word) return
        const index = g_listWord.indexOf(word)
        g_listWord[index].name = data.name
        g_listWord[index].meaning = data.meaning

    } catch (err) {
        showToast(err, 'danger')
    }

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

// ROUTER

window.addEventListener('hashchange', () => {
    if (location.hash.slice(1) === "/admin") {
        if (!g_user) {
            showToast('Bạn cần đăng nhập để truy cập.', 'warning')
            return
        }
        if (g_user && g_user.role === 'user') {
            showToast('Bạn không có quyền truy cập.', 'danger')
            return
        }
        renderInitAdminPage()
    }
})

// ----------------------- RENDER VIEW-----------------------------
// MAIN ------------
const renderInitPage = async () => {
    clear(mainEl)
    renderSpinner(mainEl)
    await getListGame()
    await renderView(mainEl, MainMarkup.initpageMarkup(g_listGame))
    // add handler
    addHandlerClickOptionGame()
    addHandlerClickOptionElevator()
}

const renderGame1 = async () => {
    clear(mainEl)
    clear(userEl)
    clear(accountEl)
    renderSpinner(mainEl)
    await renderView(mainEl, GameMarkup.gameMarkup())
    await renderView(accountEl, GameMarkup.noteGameMarkup())
    // add handler here for game 1 view
    addHandlerFocusTimeTestInput()
    addHandlerSubmitTimeTestForm1()
}

const renderGame1Content = async () => {
    const contentEle = document.querySelector('.js-game-content')
    clear(contentEle)
    renderSpinner(contentEle)
    await renderView(contentEle, GameMarkup.game1ContentMarkup(g_listWord))
    //add handler
    addHandlerInputWordGame1()
    addHandlerSubmitCheckAnswerForm1()
    addHandlerSuggestFirstChar()
    addHandlerSuggestWord()
}

const renderGame2 = async () => {
    clear(userEl)
    clear(accountEl)
    clear(mainEl)
    renderSpinner(mainEl)
    await renderView(mainEl, GameMarkup.gameMarkup())
    await renderView(accountEl, GameMarkup.noteGameMarkup())

    // add handler
    addHandlerFocusTimeTestInput()
    addHandlerSubmitTimeTestForm2()
}

const renderGame2Content = async () => {
    const contentEle = document.querySelector('.js-game-content')
    clear(contentEle)
    renderSpinner(contentEle)
    await renderView(contentEle, GameMarkup.game2ContentMarkup(g_listWord))
    // add handler
    addHandlerSelectAnswerGame2()
    addHandlerSubmitCheckAnswerForm2()
    addHandlerSelectByKeyBoardGame2()
}

const renderGame3 = async () => {
    clear(userEl)
    clear(accountEl)
    clear(mainEl)
    renderSpinner(mainEl)
    await renderView(mainEl, GameMarkup.gameMarkup())
    await renderView(accountEl, GameMarkup.noteGameMarkup())
    // add handler
    addHandlerFocusTimeTestInput()
    addHandlerSubmitTimeTestForm3()
}

const renderGame3Content = async () => {
    const contentEle = document.querySelector('.js-game-content')
    clear(contentEle)
    renderSpinner(contentEle)
    await renderView(contentEle, GameMarkup.game3ContentMarkup(g_listWord, g_numberWordComplete))
    // add handler
    addHandlerSelectGame3()
}

const renderGame4 = async () => {
    clear(userEl)
    clear(accountEl)
    clear(mainEl)
    renderSpinner(mainEl)
    await renderView(mainEl, GameMarkup.gameMarkup())
    await renderView(accountEl, GameMarkup.noteGameMarkup())
    // add handler
    addHandlerFocusTimeTestInput()
    addHandlerSubmitTimeTestForm4()
}

const renderGame4Content = async () => {
    const contentEle = document.querySelector('.js-game-content')
    clear(contentEle)
    renderSpinner(contentEle)
    await renderView(contentEle, GameMarkup.game4ContentMarkup(g_listWord, g_numberWordComplete))
    // add handler
}

// ACCOUNT --------------
// OK
const renderOptionLogin = async () => {
    clear(accountEl)
    renderSpinner(accountEl)
    await renderView(accountEl, AuthMarkup.optionLoginMarkup())
    // add handler
    addHandlerRenderOptionLogin()
    addHandlerRenderSignup()
}
// OK
const renderLoginWithEmail = async () => {
    clear(accountEl)
    renderSpinner(accountEl)
    await renderView(accountEl, AuthMarkup.formLoginWithEmailMarkup())
    // add handler
    addHandlerSubmitLogin()
}
// OK
const renderSignup = async () => {
    clear(accountEl)
    renderSpinner(accountEl)
    await renderView(accountEl, AuthMarkup.formSignUpMarkup())
    // add handler
    addHandlerValidateFormSignup()
    addHandlerSubmitSignup()
}
// OK
const renderUserDisplay = async () => {
    clear(userEl)
    await renderView(userEl, AuthMarkup.userDisplayMarkup(g_user))
    // add handler
    addHandlerLogOut()
    addHandlerRenderOptionAccount()
}
// OK
const renderLoginClick = async () => {
    clear(userEl)
    await renderView(userEl, AuthMarkup.loginClickMarkup())
    //add handler
    addHandlerClickLogIn()
}
// 
const renderUserInfo = async () => {
    clear(accountEl)
    await renderView(accountEl, AccountMarkup.userInfoMarkup(g_user))
    //add handler
    // addHandlerUpdateAvatarUser()
    addHandlerSubmitUpdateInfoUser()
    addHandlerFormUpdatePassword()
}

const renderFormUpdatePassword = async () => {
    clear(accountEl)
    await renderView(accountEl, AccountMarkup.updatePasswordMarkup())
    // add handler
    addHandlerSubmitUpdatePassword()
}
//
// OK
const renderListWordTable = async () => {
    // LOAD LẦN ĐẦU THÔI
    clear(accountEl)
    renderSpinner(accountEl)
    await getListWord()   // LOAD data lần đầu vs API
    await renderView(accountEl, AccountMarkup.listWordTableMarkup(g_listWord))
    // add handler
    addHandlerRenderAddWordInput()
    addHandlerInputSearchWord()
    addHandlerPaginatePage()
    addHandlerRenderEditWordInput()
}
// OK
const renderSearchListWordTable = async () => {
    const listword = document.querySelector('.js-list-word-table')
    const inputSearch = document.querySelector('#inputSearchWord')
    clear(listword)
    renderSpinner(listword)
    await renderView(listword, AccountMarkup.updateListWordMarkup(resultSearchListWord(inputSearch.value)))
    renderUpdatePagination()
    // add handler
    addHandlerRenderEditWordInput()
}
// OK
const renderUpdatePagination = () => {
    const paginationEl = document.querySelector('.js-pagination-list-word')
    const inputSearch = document.querySelector('#inputSearchWord')
    clear(paginationEl)
    renderSpinner(paginationEl)
    renderView(paginationEl, AccountMarkup.updatePaginationMarkup(resultSearchListWord(inputSearch.value)))
    // add handler
}
// OK
const renderListHistoryPlay = async () => {
    clear(accountEl)
    clear(mainEl)
    renderSpinner(mainEl)
    await getListHistoryOfCurrentUser()
    await renderView(mainEl, MainMarkup.listHistoryPlayMarkup(g_listHistoryPlay))
    await renderView(accountEl, MainMarkup.filterHistoryPlayMarkup(g_listGame))
    // add handler
    addHandlerChangeFilterHistory()
}


//--------------Admin ----------------------
// Updating ...
const renderInitAdminPage = () => {
    // clear(headerEl)
    clear(contentEl)
    clear(userEl)
    renderView(contentEl, AdminMarkup.adminPageInitMarkup())
    // Add handler
}

// ------------------------- ADD HANDLER -------------------------------
// Init Page Load ====
// OK
const addHandlerClickOptionGame = async () => {
    const btnGame1 = document.querySelector('.js-game-1')
    const btnGame2 = document.querySelector('.js-game-2')
    const btnGame3 = document.querySelector('.js-game-3')
    const btnGame4 = document.querySelector('.js-game-4')
    btnGame1.addEventListener('click', async () => {
        if (!g_user) {
            showToast('Bạn cần đăng nhập để tiếp tục', 'warning')
            return
        }
        await getListWord()
        if (g_listWord.length < 10) {
            showToast('Bảng từ vựng cần tối thiểu 10 từ để tham gia trò chơi.', 'warning')
            return
        }
        g_gameId = btnGame1.getAttribute('id')
        renderGame1()
    })

    btnGame2.addEventListener('click', async () => {
        if (!g_user) {
            showToast('Bạn cần đăng nhập để tiếp tục', 'warning')
            return
        }
        await getListWord()
        if (g_listWord.length < 20) {
            showToast('Bảng từ vựng cần tối thiểu 20 từ để tham gia trò chơi.', 'warning')
            return
        }
        g_gameId = btnGame2.getAttribute('id')
        renderGame2()
    })

    btnGame3.addEventListener('click', async () => {
        if (!g_user) {
            showToast('Bạn cần đăng nhập để tiếp tục', 'warning')
            return
        }
        await getListWord()
        if (g_listWord.length < 10) {
            showToast('Bảng từ vựng cần tối thiểu 10 từ để tham gia trò chơi.', 'warning')
            return
        }
        g_gameId = btnGame3.getAttribute('id')
        renderGame3()
    })
    btnGame4.addEventListener('click', async (e) => {
        if (!g_user) {
            showToast('Bạn cần đăng nhập để tiếp tục', 'warning')
            return
        }
        await getListWord()
        if (g_listWord.length < 20) {
            showToast('Bảng từ vựng cần tối thiểu 20 từ để tham gia trò chơi.', 'warning')
            return
        }
        g_gameId = btnGame4.getAttribute('id')
        renderGame4()
    })
}

const addHandlerClickOptionElevator = async () => {
    const dictionEl = document.querySelector('.js-show-dictionary')

    dictionEl.addEventListener('click', (e) => {
        document.querySelector('.js-dictionary-wrapper').style.display = "block";
    })
    document.querySelector('.js-dictionary-wrapper i').addEventListener('click', (e) => {
        document.querySelector('.js-dictionary-wrapper').style.display = "none";
    })
}

//============= GAME =================
// OK
const addHandlerFocusTimeTestInput = () => {
    // $('#timeTestModal').modal('show')
    document.querySelector('.js-btn-start-game').click()
    document.querySelector('#timeTestModal').addEventListener('click', (e) => {
        document.querySelector('#inputTimeTest').focus()
    })
    document.addEventListener('keydown', () => {
        document.querySelector('#inputTimeTest').focus()
    })
}
// OK
const addHandlerSubmitTimeTestForm1 = () => {
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
        if (timeTest > 1000) {
            document.querySelector('#timeTestHelp').textContent = `Tối đa 1000 lượt.`
            return false
        }
        g_numberWordComplete = timeTest
        g_timeTest = timeTest
        g_timeSuggest = Number.parseInt(timeTest / 7)
        g_timeLive = Number.parseInt(timeTest / 4) + 1
        g_timeOut = (timeTest * SECOND_PER_TEST * 1000)
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

        $('#timeTestModal').modal('hide')
        document.querySelector('.js-time-game').classList.remove('hidden')
        document.querySelector('.js-btn-start-game').classList.add('hidden')
        document.querySelector('.js-time-test-display span').textContent = g_timeTest
        document.querySelector('.js-time-suggest-display span').textContent = g_timeSuggest
        document.querySelector('.js-time-live-display span').textContent = g_timeLive
        renderGame1Content()
        document.querySelector('#inputWordGame1').focus()
    })
}
// OK
const addHandlerSubmitTimeTestForm2 = () => {
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
        if (timeTest > 1000) {
            document.querySelector('#timeTestHelp').textContent = `Tối đa 1000 lượt.`
            return false
        }
        g_numberWordComplete = timeTest
        g_timeTest = timeTest
        g_timeSuggest = 0
        g_timeLive = Number.parseInt(timeTest / 4) + 1
        g_timeOut = (timeTest * SECOND_PER_TEST * 1000)
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

        $('#timeTestModal').modal('hide')
        document.querySelector('.js-time-game').classList.remove('hidden')
        document.querySelector('.js-btn-start-game').classList.add('hidden')
        document.querySelector('.js-time-test-display span').textContent = g_timeTest
        document.querySelector('.js-time-suggest-display span').textContent = g_timeSuggest
        document.querySelector('.js-time-live-display span').textContent = g_timeLive
        renderGame2Content()
    })
}

const addHandlerSubmitTimeTestForm3 = () => {
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
        if (timeTest > 18) {
            document.querySelector('#timeTestHelp').textContent = `Tối đa 18 cặp từ.`
            return false
        }
        if (timeTest < 2) {
            document.querySelector('#timeTestHelp').textContent = `Tối thiểu 2 cặp từ.`
            return false
        }
        if (timeTest > g_listWord.length) {
            document.querySelector('#timeTestHelp').textContent = `Số cặp từ không được vượt qua lượng từ vựng của bạn.`
            return false
        }
        g_numberWordComplete = timeTest
        g_timeTest = timeTest
        g_timeSuggest = 0
        g_timeLive = 1
        g_timeOut = (timeTest * SECOND_PER_TEST * 1000)
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

        $('#timeTestModal').modal('hide')
        document.querySelector('.js-time-game').classList.remove('hidden')
        document.querySelector('.js-btn-start-game').classList.add('hidden')
        document.querySelector('.js-time-test-display span').textContent = g_timeTest
        document.querySelector('.js-time-suggest-display span').textContent = g_timeSuggest
        document.querySelector('.js-time-live-display span').textContent = g_timeLive
        renderGame3Content()
    })
}

const addHandlerSubmitTimeTestForm4 = () => {
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
        if (timeTest > 100) {
            document.querySelector('#timeTestHelp').textContent = `Tối đa 100 từ.`
            return false
        }
        if (timeTest < 10) {
            document.querySelector('#timeTestHelp').textContent = `Tối thiểu 10 từ.`
            return false
        }
        if (timeTest > g_listWord.length * 1.3) {
            document.querySelector('#timeTestHelp').textContent = `Số từ kiểm tra cần nhỏ hơn từ vựng của bạn một lượng nhất định.`
            return false
        }
        g_numberWordComplete = timeTest
        g_timeTest = timeTest
        g_timeSuggest = 0
        g_timeLive = 1
        g_timeOut = (timeTest * SECOND_PER_TEST * 1000)
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

        $('#timeTestModal').modal('hide')
        document.querySelector('.js-time-game').classList.remove('hidden')
        document.querySelector('.js-btn-start-game').classList.add('hidden')
        document.querySelector('.js-time-test-display span').textContent = g_timeTest
        document.querySelector('.js-time-suggest-display span').textContent = g_timeSuggest
        document.querySelector('.js-time-live-display span').textContent = g_timeLive
        renderGame4Content()

    })
}
// Game 1 -------------
const addHandlerInputWordGame1 = () => {
    document.querySelector('#inputWordGame1').addEventListener('input', (e) => {
        e.target.classList.remove('is-invalid')
        e.target.value = e.target.value.toLowerCase()
    })
}
// OK
const addHandlerSubmitCheckAnswerForm1 = () => {
    document.querySelector('.js-form-check-answer-game1').addEventListener('submit', async (e) => {
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
            return el.name === inputWord.value.trim()
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
                showToast('Rất tiếc bạn đã không hoàn thành trò chơi.', 'danger')
                setTimeout(() => {
                    location.assign('/')
                }, 2000)
                return
            }
            inputWord.focus()
            return
        }
        // Right answer
        g_timeTest--
        if (g_timeTest === 0) {
            // Complete Game 
            showToast('Chúc mừng bạn đã hoàn thành xuất sắc trò chơi.', 'info')
            const data = {
                numberOfTest: g_numberWordComplete,
                numberOfWord: g_listWord.length,
                dateCompleted: new Date().toLocaleString("en-US")
            }
            await addHistory(data, g_gameId)
            location.assign('/')
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
// OK
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
            return el.name.charAt(0)
        })
        const random = Math.floor(Math.random() * firstCharSug.length)
        document.querySelector('#inputWordGame1').value = firstCharSug[random]
        document.querySelector('#inputWordGame1').focus()
    })
}
// OK
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
            return `${el.name}`
        }).join(' / ')
        g_timeSuggest--
        addNoteWordInGame(meaning, listSuggest.map((el) => {
            return `${el.name}`
        }).join(' / '))
        document.querySelector('.js-time-suggest-display span').innerText = g_timeSuggest
        document.querySelector('.js-time-suggest-display').classList.remove('btn-outline-primary')
        document.querySelector('.js-time-suggest-display').classList.add('btn-warning')
    })
}
// Game 2 ------------
// OK
const addHandlerSelectAnswerGame2 = () => {
    const btns = document.querySelectorAll('.form-check button')
    for (let btn of btns) {
        btn.addEventListener('click', (e) => {
            btn.parentElement.querySelector('input').click()
            for (let btnn of btns) {
                btnn.classList.remove('btn-primary')
                btnn.classList.add('btn-outline-primary')
            }
            btn.classList.remove('btn-outline-primary')
            btn.classList.add('btn-primary')
            // console.log(btn.parentElement.querySelector('input').value)
        })

    }
}
//
const addHandlerSelectByKeyBoardGame2 = () => {
    document.addEventListener('keypress', (e) => {
        switch (e.key) {
            case "1":
                document.querySelector('.js-answer-1').click()
                break;
            case "2":
                document.querySelector('.js-answer-2').click()
                break;
            case "3":
                document.querySelector('.js-answer-3').click()
                break;
            case "4":
                document.querySelector('.js-answer-4').click()
                break;
        }
    })
}

const addHandlerSubmitCheckAnswerForm2 = () => {
    document.querySelector('.js-form-check-answer-game2').addEventListener('submit', async (e) => {
        e.preventDefault()
        let inputAnswer
        let inputs = document.getElementsByName('answer')
        for (let input of inputs) {
            if (input.checked) {
                inputAnswer = input.value
            }
        }
        const timeTestDisplay = document.querySelector('.js-time-test-display')
        const timeLiveDisplay = document.querySelector('.js-time-live-display')
        const index = document.querySelector('.js-btn-check-answer').getAttribute('id')
        const checkAns = inputAnswer === g_listWord[index].name
        if (!checkAns) {
            // Wrong answer
            g_timeLive--
            document.querySelector('.js-time-live-display span').innerText = g_timeLive
            timeTestDisplay.classList.remove('btn-success')
            timeTestDisplay.classList.add('btn-outline-primary')
            timeLiveDisplay.classList.remove('btn-outline-primary')
            timeLiveDisplay.classList.add('btn-danger')
            if (g_timeLive === 0 || g_timeLive < 0) {
                showToast('Rất tiếc bạn đã không hoàn thành trò chơi.', 'danger')
                setTimeout(() => {
                    location.assign('/')
                }, 2000)
                return
            }
            return
        }
        // Right answer
        g_timeTest--
        if (g_timeTest === 0) {
            // Complete Game 
            showToast('Chúc mừng bạn đã hoàn thành xuất sắc trò chơi.', 'info')
            const data = {
                numberOfTest: g_numberWordComplete,
                numberOfWord: g_listWord.length,
                dateCompleted: new Date().toLocaleString("en-US")
            }
            await addHistory(data, g_gameId)
            location.assign('/')
            return
        }
        timeTestDisplay.classList.remove('btn-outline-primary')
        timeTestDisplay.classList.add('btn-success')
        timeLiveDisplay.classList.remove('btn-danger')
        timeLiveDisplay.classList.add('btn-outline-primary')
        document.querySelector('.js-time-test-display span').innerText = g_timeTest
        renderGame2Content()
        return
    })
}
// Game 3 ------------
const addHandlerSelectGame3 = () => {
    document.querySelector('.js-list-answer-game3').addEventListener('click', async (e) => {
        const btn = e.target.closest('button')
        if (!btn) return
        let current
        // const changeStyleBtn = (ele) => {
        //     ele.querySelector('span').classList.toggle("hidden")
        //     ele.classList.toggle("btn-outline-primary")
        //     ele.classList.toggle("btn-primary")
        // }
        let btns = document.querySelectorAll('.js-list-answer-game3 button')
        for (let btnn of btns) {
            // find the current 
            if (btnn.classList.contains('btn-primary')) {
                current = btnn
                break;
            }
        }
        if (current) {
            // second choice
            if (current === btn) {
                // changeStyleBtn(btn)
                btn.querySelector('span').classList.add("hidden")
                btn.classList.add("btn-outline-primary")
                btn.classList.remove("btn-primary")
                return
            }
            if (btn !== current) {
                // changeStyleBtn(btn)
                btn.querySelector('span').classList.remove("hidden")
                btn.classList.remove("btn-outline-primary")
                btn.classList.add("btn-primary")
                // XỬ LÝ SO SÁNH KẾT QUẢ BTN vs CURRENT
                const btn1Value = current.firstElementChild.innerText
                const btn2Value = btn.firstElementChild.innerText
                const listRight = g_listWord.filter((el) => {
                    return el.meaning === btn1Value
                })
                const listRight2 = g_listWord.filter((el) => {
                    return el.name === btn1Value
                })
                const listRightName = listRight.map((el) => {
                    return el.name
                })
                const listRightMeaning = listRight2.map((el) => {
                    return el.meaning
                })
                if (listRightName.includes(btn2Value) || listRightMeaning.includes(btn2Value)) {
                    // RIGHT
                    setTimeout(async () => {
                        btn.outerHTML = `
                        <button type="button" class="btn btn-outline-success border-0 mt-1" 
                            style="width:24%;height:50px;overflow: hidden;user-select: none;" disabled>
                            
                        </button>
                        `
                        current.outerHTML = `
                        <button type="button" class="btn btn-outline-success border-0 mt-1" 
                            style="width:24%;height:50px;overflow: hidden;user-select: none;" disabled>
                            
                        </button>
                        `
                        // const noteEl = document.querySelector('js-list-note-game')
                        addNoteWordInGame(btn1Value, btn2Value)
                        btns = document.querySelectorAll('.js-list-answer-game3 button')
                        let check = true
                        for (let btnn of btns) {
                            if (btnn.classList.contains('btn-outline-primary')) {
                                check = false
                                break;
                            }
                        }
                        if (check) {
                            showToast('Chúc mừng bạn đã hoàn thành xuất sắc trò chơi.', 'info')
                            const data = {
                                numberOfTest: g_numberWordComplete,
                                numberOfWord: g_listWord.length,
                                dateCompleted: new Date().toLocaleString("en-US")
                            }
                            await addHistory(data, g_gameId)
                            location.assign('/')
                        }
                    }, 500)
                    return
                }
                // WRONG
                setTimeout(() => {
                    // changeStyleBtn(btn)
                    // changeStyleBtn(current)
                    btn.querySelector('span').classList.add("hidden")
                    btn.classList.add("btn-outline-primary")
                    btn.classList.remove("btn-primary")
                    current.querySelector('span').classList.add("hidden")
                    current.classList.add("btn-outline-primary")
                    current.classList.remove("btn-primary")
                }, 500)
                return
            }

            return
        }
        // first choice
        // changeStyleBtn(btn)
        btn.querySelector('span').classList.remove("hidden")
        btn.classList.remove("btn-outline-primary")
        btn.classList.add("btn-primary")
    })
}

// ================ AUTH ===============
// Update
const addHandlerRenderOptionLogin = () => {
    const btnLoginwithEmail = document.querySelector('.js-btn-login-email')
    const btnLoginwithFacebook = document.querySelector('.js-btn-login-facebook')
    const btnLoginwithGoogle = document.querySelector('.js-btn-login-google')
    btnLoginwithEmail.addEventListener('click', () => {
        renderLoginWithEmail()
    })
    btnLoginwithFacebook.addEventListener('click', () => {
        showToast('Tính năng đang phát triển. Vui lòng thử lại sau!', 'info')
    })
    btnLoginwithGoogle.addEventListener('click', () => {
        showToast('Tính năng đang phát triển. Vui lòng thử lại sau!', 'info')
    })

}
// OK
const addHandlerRenderSignup = () => {
    document.querySelector('.js-signup').addEventListener('click', (e) => {
        renderSignup()
    })
}
// OK
const addHandlerClickLogIn = () => {
    document.querySelector('.js-login').addEventListener('click', () => {
        renderOptionLogin()
    })
}
// OK
const addHandlerValidateFormSignup = () => {
    const inputEmail = document.querySelector('#inputSignupEmail')
    const inputName = document.querySelector('#inputSignupName')
    const inputPassword = document.querySelector('#inputSignupPassWord')
    const inputPasswordConf = document.querySelector('#inputSignupPassWordConfirm')
    inputEmail.addEventListener('input', (e) => {
        e.target.classList.remove('is-invalid')
    })
    inputName.addEventListener('input', (e) => {
        e.target.classList.remove('is-invalid')
    })

    inputPassword.addEventListener('input', (e) => {
        e.target.classList.remove('is-invalid')
    })
    inputEmail.addEventListener('blur', (e) => {
        if (!isEmail(e.target.value.trim())) {
            e.target.classList.add('is-invalid')
        }
    })
    inputName.addEventListener('blur', (e) => {
        if (!existMinChar(e.target.value.trim(), 4) || !existMaxChar(e.target.value.trim(), 30)) {
            e.target.classList.add('is-invalid')
        }
    })
    inputPassword.addEventListener('blur', (e) => {
        if (!existMinChar(e.target.value, 6)) {
            e.target.classList.add('is-invalid')
        }
    })
    inputPasswordConf.addEventListener('input', (e) => {
        e.target.classList.remove('is-invalid')
        if (!isEqual(inputPassword.value, e.target.value)) {
            e.target.classList.add('is-invalid')
        }
    })
}
// OK
const addHandlerSubmitSignup = () => {
    document.querySelector('.js-form-signup').addEventListener('submit', async (e) => {
        e.preventDefault()
        const passwordConfirmInput = document.querySelector('#inputSignupPassWordConfirm')
        const passwordInput = document.querySelector('#inputSignupPassWord')
        const emailInput = document.querySelector('#inputSignupEmail')
        const nameInput = document.querySelector('#inputSignupName')
        if (emailInput.classList.contains('is-invalid')) {
            emailInput.focus()
            return
        }
        if (nameInput.classList.contains('is-invalid')) {
            nameInput.focus()
            return
        }
        if (passwordInput.classList.contains('is-invalid')) {
            passwordInput.focus()
            return
        }
        if (passwordConfirmInput.classList.contains('is-invalid')) {
            passwordConfirmInput.focus()
            return
        }
        const email = emailInput.value.trim()
        const name = nameInput.value.trim()
        const password = passwordInput.value.trim()
        const passwordConfirm = passwordConfirmInput.value.trim()
        try {
            document.querySelector('.js-form-signup button').innerText = 'Đăng ký...'
            await signup({ email, name, password, passwordConfirm })
            await getUserFromLocalStorage()
            showToast('Đăng ký tài khoản thành công.', 'success')
            renderUserDisplay()
            clear(accountEl)
        } catch (err) {
            document.querySelector('.js-form-signup button').innerText = 'Đăng ký'
            showToast(err, 'danger')
        }

    })
}
// OK
const addHandlerSubmitLogin = () => {
    document.querySelector('.js-form-login').addEventListener('submit', async (e) => {
        e.preventDefault()
        const email = document.querySelector('#inputLoginEmail').value.trim()
        const password = document.querySelector('#inputLoginPassWord').value.trim()
        try {
            await login({ email, password })
            await getUserFromLocalStorage()
            showToast('Đăng nhập thành công.', 'success')
            renderUserDisplay()
            clear(accountEl)
        } catch (err) {
            showToast(err, 'danger')
        }
    })
}
// OK
const addHandlerLogOut = () => {
    document.querySelector('.js-logout').addEventListener('click', async (e) => {
        try {
            await logout()
            await getUserFromLocalStorage()
            showToast('Bạn đã đăng xuất', 'info')
            g_listWord = undefined
            g_listHistoryPlay = undefined
            renderLoginClick()
            renderOptionLogin()
            renderInitPage()
        } catch (err) {
            showToast(err, 'danger')
            localStorage.removeItem('user')
            window.setTimeout(() => {
                location.assign('/')               // chuyển pages sau 2s
            }, 2000)
        }
    })
}
// ============= ACCOUNT + FIRST RENDER =====================
const addHandlerRenderOptionAccount = () => {
    document.querySelector('.js-user-info').addEventListener('click', (e) => {
        renderUserInfo()
    })
    document.querySelector('.js-list-game').addEventListener('click', (e) => {
        renderInitPage()
    })
    document.querySelector('.js-user-vocab').addEventListener('click', () => {
        renderListWordTable()
    })
    document.querySelector('.js-user-history-play').addEventListener('click', () => {
        renderListHistoryPlay()
    })
}

const addHandlerUpdateAvatarUser = () => {
    document.querySelector('#inputAvatarUser').addEventListener('change', (e) => {
        readImg(e.target, '.user__avatar')
    })
}

const addHandlerSubmitUpdateInfoUser = () => {
    document.querySelector('.js-form-user-info').addEventListener('submit', async (e) => {
        e.preventDefault()
        if (document.querySelector('#inputInfoName').classList.contains('is-invalid')) {
            document.querySelector('#inputInfoName').focus()
            return
        }
        try {
            const form = new FormData()
            form.append('name', document.querySelector('#inputInfoName').value.trim())
            // form.append('avatar', document.querySelector('#inputAvatarUser').files[0])
            e.target.querySelector('button').textContent = 'Đang cập nhật ...'
            await updateInfoCurrentUser(form)
            await getUserFromLocalStorage()
            renderUserDisplay()
            showToast('Cập nhật thành công', 'success')
            e.target.querySelector('button').textContent = 'Cập nhật'
        } catch (err) {
            showToast(err, 'danger')
            e.target.querySelector('button').textContent = 'Cập nhật'

        }
    })
    //---------------- validate ------------
    document.querySelector('#inputInfoName').addEventListener('input', (e) => {
        e.target.classList.remove('is-invalid')
    })
    document.querySelector('#inputInfoName').addEventListener('blur', (e) => {
        if (!existMinChar(e.target.value.trim(), 4) || !existMaxChar(e.target.value.trim(), 30)) {
            e.target.classList.add('is-invalid')
        }
    })
}

const addHandlerFormUpdatePassword = () => {
    document.querySelector('.js-update-password').addEventListener('click', (e) => {
        renderFormUpdatePassword()
    })
}

const addHandlerSubmitUpdatePassword = () => {
    const inputPassword = document.querySelector('#inputNewPassWord')
    const inputPasswordConf = document.querySelector('#inputNewPassWordConfirm')
    document.querySelector('.js-form-update-password').addEventListener('submit', async (e) => {
        e.preventDefault()
        if (inputPassword.classList.contains('is-invalid')) {
            inputPassword.focus()
            return
        }
        if (inputPasswordConf.classList.contains('is-invalid')) {
            inputPasswordConf.focus()
            return
        }
        try {
            e.target.querySelector('button').textContent = 'Đang cập nhật ...'
            const data = {
                passwordCurrent: document.querySelector('#inputCurrentPassword').value.trim(),
                password: inputPassword.value.trim(),
                passwordConfirm: inputPasswordConf.value.trim(),
            }
            await updatePassword(data)
            showToast('Cập nhật thành công', 'success')
            renderUserInfo()
        } catch (err) {
            showToast(err, 'danger')
            renderFormUpdatePassword()
        }
    })
    // ---- validate ----
    inputPassword.addEventListener('input', (e) => {
        e.target.classList.remove('is-invalid')
    })
    inputPassword.addEventListener('blur', (e) => {
        if (!existMinChar(e.target.value, 6)) {
            e.target.classList.add('is-invalid')
        }
    })
    inputPasswordConf.addEventListener('input', (e) => {
        e.target.classList.remove('is-invalid')
        if (!isEqual(e.target.value, inputPassword.value)) {
            e.target.classList.add('is-invalid')
        }
    })

}

// List word table ------------------
// OK
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
                        Tối đa 100 ký tự.
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
            renderListWordTable()
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
// OK
const addHandlerAddWord = () => {
    const handleAddWordSuccess = (newWord) => {
        document.querySelector('#inputAddWord').value = ''
        document.querySelector('#inputAddWord').focus()
        document.querySelector('#inputAddMeaning').value = ''
        document.querySelector('#inputAddWordHelp').textContent = ''
        document.querySelector('#inputAddMeaningHelp').textContent = ''
        document.querySelector('#inputAddWord').classList.remove('is-valid')
        document.querySelector('#inputAddMeaning').classList.remove('is-valid')
        const markup = `
        <tr>
            <td>${newWord.name}</td>
            <td>${newWord.meaning}</td>
            <td>
                <button type="button" class="btn btn-outline-success btn-sm disabled">New</button>
            </td>
        </tr>
        `
        document.querySelector('.js-list-word-table tbody').firstElementChild.insertAdjacentHTML('afterend', markup)
    }
    const handleAddWord = async () => {
        const inputWord = document.querySelector('#inputAddWord')
        const inputMeaning = document.querySelector('#inputAddMeaning')
        if (!inputWord.classList.contains('is-valid') || !inputMeaning.classList.contains('is-valid')) {
            return
        }
        const name = inputWord.value.trim()
        const meaning = inputMeaning.value.trim()
        try {
            await addWord({ name, meaning })
            handleAddWordSuccess({ name, meaning })
        }
        catch (err) {
            showToast(err, 'danger')
        }
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
        const name = e.target.value.trim()
        if (!name) {
            document.querySelector('#inputAddWordHelp').textContent = 'Không được bỏ trống.'
            e.target.classList.remove('is-valid')
            return
        }
        document.querySelector('#inputAddWordHelp').textContent = ''
        if (!isWordUnique(name, g_listWord)) {
            document.querySelector('#inputAddWord').classList.add('is-invalid')
            return
        }
        document.querySelector('#inputAddWord').classList.remove('is-invalid')
        document.querySelector('#inputAddWord').classList.add('is-valid')
    })
    document.querySelector('#inputAddMeaning').addEventListener('input', (e) => {
        const meaning = e.target.value.trim()
        if (!meaning) {
            document.querySelector('#inputAddMeaningHelp').textContent = 'Không được bỏ trống.'
            e.target.classList.remove('is-valid')
            return
        }
        document.querySelector('#inputAddMeaningHelp').textContent = ''
        if (!existMaxChar(meaning, 100)) {
            document.querySelector('#inputAddMeaning').classList.add('is-invalid')
            return
        }
        document.querySelector('#inputAddMeaning').classList.remove('is-invalid')
        document.querySelector('#inputAddMeaning').classList.add('is-valid')
    })
}
// OK
const addHandlerInputSearchWord = () => {
    document.querySelector('#inputSearchWord').addEventListener('input', (e) => {
        e.target.value = e.target.value.toLowerCase()
        document.querySelector('.js-pagination-list-word').setAttribute('data-index', 1)
        renderSearchListWordTable()
    })
}
// OK
const addHandlerRenderEditWordInput = () => {
    const listWord = document.querySelectorAll('.js-list-word-table tbody tr[id]')
    for (let word of listWord) {
        word.addEventListener('click', (e) => {
            let id = word.getAttribute('id')
            const btnRemoveWord = e.target.closest('.js-btn-remove-word')
            if (btnRemoveWord) {
                // Remove Word
                document.querySelector('.js-btn-confirm-remove-word').addEventListener('click', async (e) => {
                    $('#confirmRemoveWordModal').modal('hide')
                    await removeWordNow(id)
                    await renderSearchListWordTable()
                    console.log(id)
                    return
                })
                return
            }
            // Update Word
            let currentWord = findWordById(id)
            let initWord = currentWord.name
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
            // // word.outerHTML = markup
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

            document.querySelector('.js-btn-confirm-edit-word').addEventListener('click', async () => {
                const variWord = inputEditWord.value.trim()
                const variMeaning = inputEditMeaning.value.trim()
                if (inputEditWord.classList.contains('is-valid') && (inputEditMeaning.classList.contains('is-valid'))) {
                    // Cập nhật thành công
                    await updateWordNow({ name: variWord, meaning: variMeaning }, id)
                    await renderSearchListWordTable()
                    return
                }
                // thông báo Cập nhật thất bại
                showToast('Cập nhật thất bại.', 'danger')
                renderSearchListWordTable()
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
// OK
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

// List history table ---------------------
const addHandlerChangeFilterHistory = () => {
    document.querySelector('.js-filter-history-game').addEventListener('submit', (e) => {
        e.preventDefault()
        const dateFrom = document.querySelector('#inputDateFromFilter').value
        const dateTo = document.querySelector('#inputDateToFilter').value
        if (!dateFrom || !dateTo) {
            showToast('Bạn cần nhập đầy đủ thời điểm', 'warning')
            return
        }
        const fromArr = dateFrom.split('-')
        const toArr = dateTo.split('-')
        const dayFrom = fromArr[2]
        const monthFrom = fromArr[1]
        const yearFrom = fromArr[0]
        const dayTo = toArr[2]
        const monthTo = toArr[1]
        const yearTo = toArr[0]
        if (yearTo < yearFrom) {
            showToast('Lỗi thời điểm', 'danger')
            return
        }
        if (yearTo === yearFrom) {
            if (monthTo < monthFrom) {
                showToast('Lỗi thời điểm', 'danger')
                return
            }
            if (monthTo === monthFrom) {
                if (dayTo < dayFrom) {
                    showToast('Lỗi thời điểm', 'danger')
                    return
                }
            }
        }
        const newList = g_listHistoryPlay.filter((el) => {
            // let isOK = true
            const dateArr = el.dateCompleted.split(',')[0].split('/')
            const year = dateArr[2]
            const month = dateArr[0]
            const day = dateArr[1]
            if (year < yearFrom || year > yearTo) return false
            if (year === yearFrom) {
                if (month < monthFrom) return false
                if (month === monthFrom) {
                    if (day < dayFrom) return false
                }
            }
            if (year === yearTo) {
                if (month > monthTo) return false
                if (month === monthTo) {
                    if (day > dayTo) return false
                }
            }
            return true
        })
        // console.log(newList)

        const gameId = document.querySelector('#selectGameHistory').value
        if (gameId === "0") {
            clear(mainEl)
            renderView(mainEl, MainMarkup.listHistoryPlayMarkup(newList))
            return
        }
        const newList2 = newList.filter((el) => {
            return el.game.id === gameId
        })
        clear(mainEl)
        renderView(mainEl, MainMarkup.listHistoryPlayMarkup(newList2))
    })
}

// --------------------------- INIT -------------------------
const init = async () => {
    try {
        await getUserFromLocalStorage()
        if (!g_user) {
            renderLoginClick()
        } else {
            renderUserDisplay()
        }
        renderInitPage()
    }
    catch (err) {
        showToast(err, 'danger')
    }
}
init()