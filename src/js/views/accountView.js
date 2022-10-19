import { RESULT_PER_PAGE } from '../config'

class AccountMarkup {

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

    userInfoMarkup(user) {
        return `
        <form class="js-form-user-info">
            <h3 class="mb-3">Tài khoản</h3>
            <div class="form-group">
                <label for="inputInfoEmail">Email</label>
                <input type="text" class="form-control" id="inputInfoEmail"
                    aria-describedby="inputInfoEmailHelp" placeholder="Địa chỉ email..."
                    autocomplete="off" value="${user.email}" disabled>
                <div class="invalid-feedback">
                    Trường này phải nhập một email.
                </div>
            </div>
            <div class="form-group">
                <label for="inputInfoName">Họ và Tên</label>
                <input type="text" class="form-control" id="inputInfoName"
                    aria-describedby="inputInfoNameHelp" placeholder="Họ và tên của bạn..."
                    autocomplete="off" value="${user.name}">
                <div class="invalid-feedback">
                    Trường này nhập ít nhất 4 ký tự, tối đa 30 kí tự.
                </div>
            </div>
            <p class="text-secondary">Đổi mật khẩu?
                <a href="#" class="text-dark js-update-password">Click here</a>
            </p>
            <button type="submit" class="btn btn-primary btn-block">Cập nhật</button>
        </form>
        `
    }

    updatePasswordMarkup() {
        return `
        <form class="js-form-update-password">
            <h3 class="mb-3">Cập nhật mật khẩu</h3>
            <div class="form-group">
                <label for="inputCurrentPassword">Mật khẩu hiện tại</label>
                <input type="password" class="form-control" id="inputCurrentPassword"
                     placeholder="******" autocomplete="off">
            </div>
            <div class="form-group">
                <label for="inputNewPassWord">Mật khẩu mới</label>
                <input type="password" class="form-control" id="inputNewPassWord"
                     placeholder="******" autocomplete="off">
                <div class="invalid-feedback">
                    Mật khẩu cần ít nhất 6 ký tự.
                </div>
            </div>
            <div class="form-group">
                <label for="inputNewPassWordConfirm">Xác nhận mật khẩu</label>
                <input type="password" class="form-control" id="inputNewPassWordConfirm"
                     placeholder="******" autocomplete="off">
                <div class="invalid-feedback">
                    Mật khẩu không trùng khớp.
                </div>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Cập nhật</button>
        </form>
        `
    }
}

export default new AccountMarkup()