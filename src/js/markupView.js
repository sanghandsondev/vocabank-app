//------------------------ MARKUP -------------------------------
class Markup {
    super() {

    }
    // OK
    initpageMarkup(list) {
        const markup = list.map((el, index) => {
            return `
            <div class="col-xl-12 col-sm-12 col-lg-12 mb-3">
                <div class="card">
                    <div id="${el._id}" class="js-game-${index + 1}">
                        <div class="game-intro card-body">
                            <h5 class="card-title">
                                ${el.title}
                                <span class="badge badge-pill badge-${el.difficulty}">${el.status}</span>
                            </h5>
                            <p class="card-text">
                                ${el.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `
        }).join('')
        return `
    <div class="row">
        ${markup}
    </div>
    `
    }
    //Update
    game1Markup() {

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
    //Update
    game1ContentMarkup(list) {
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
    // OK
    optionLoginMarkup() {
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
    // OK
    formLoginWithEmailMarkup() {
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
    // OK
    formSignUpMarkup() {
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
            <label for="inputSignupName">Họ và Tên</label>
            <input type="text" class="form-control" id="inputSignupName"
                aria-describedby="inputSignupNameHelp" placeholder="Họ và tên của bạn..."
                autocomplete="off">
            <div class="invalid-feedback">
                Trường này nhập ít nhất 4 ký tự, tối đa 30 kí tự.
            </div>
        </div>
        <div class="form-group">
            <label for="inputSignupPassWord">Mật khẩu</label>
            <input type="password" class="form-control" id="inputSignupPassWord"
                placeholder="Mật khẩu..." autocomplete="off">
            <div class="invalid-feedback">
                Mật khẩu nhập ít nhất 6 ký tự.
            </div>
        </div>
        <div class="form-group">
            <label for="inputSignupPassWordConfirm">Xác nhận mật khẩu</label>
            <input type="password" class="form-control" id="inputSignupPassWordConfirm"
                placeholder="Xác nhận mật khẩu..." autocomplete="off">
            <div class="invalid-feedback">
                Mật khẩu không trùng khớp.
            </div>
        </div>

        <button type="submit" class="btn btn-primary btn-block">Đăng ký</button>
    </form>
    `
    }
    // OK
    loginClickMarkup() {
        return `
    <li class="nav-item mr-5">
        <a class="nav-link js-login" href="#">Đăng nhập</a>
    </li>
    `
    }
    // OK
    userDisplayMarkup(user) {
        const linkAdminPage = (user.role === "admin" || user.role === "superadmin") ? `<a class="dropdown-item js-user-admin-page" href="#admin123123123">Trang Admin</a>` : ''
        return `
    <li class="nav-item dropdown mr-5">
        <a class="nav-link dropdown-toggle text-light mr-5" href="#" id="navbarDropdown" role="button"
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            ${user.name}
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
    // OK
    listWordTableMarkup(list) {
        let markupPagi
        const numPages = Math.ceil(list.length / RESULT_PER_PAGE)

        list = list.slice(0, RESULT_PER_PAGE)

        const markupList = list.map((el, index) => {

            return `
        <tr id="${el._id}">
            <td>    
                ${el.name}
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
    // OK
    updateListWordMarkup(list) {
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
        <tr id="${el._id}">
            <td>    
                ${el.name}
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
    // OK
    updatePaginationMarkup(list) {
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
    // OK
    listHistoryPlayMarkup(list) {
        const length = list.length
        let derseList = []
        let markupMore = length > RESULT_PER_PAGE ? `<button class="btn btn-outline-info btn-sm js-btn-more-history">Xem tất cả ...</button>` : ''
        for (let i = length - 1; i >= length - RESULT_PER_PAGE; i--) {
            if (i < 0) break
            derseList.push(list[i])
        }
        const markupList = derseList.map((el) => {
            const date = el.dateCompleted.split('.')[0]
            return `
            <tr>
                <td class="text-${el.game.difficulty}">${el.game.title}</td>
                <td class="text-center">${el.numberOfTest}/${el.numberOfWord}</td>
                <td>${date}</td>
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

    // CẦN FIX THÊM
    allHistoryPlayMarkup(list) {
        const length = list.length
        const derseList = list.map((el, index) => {
            return list[length - 1 - index]
        })
        const markupList = derseList.map((el, index) => {
            return `
        <tr>
            <td class="text-${el.game.difficulty} text-center">${el.game.title}</td>
            <td class="text-center">${el.numberOfTest}/${el.numberOfWord}</td>
            <td class="text-center">${el.dateCompleted.split('.')[0]}</td>
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
    adminPageInitMarkup() {
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
}

export default new Markup()