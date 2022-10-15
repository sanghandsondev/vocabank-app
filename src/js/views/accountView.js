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

}

export default new AccountMarkup()