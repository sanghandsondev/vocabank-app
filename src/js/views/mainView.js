
class MainMarkup {
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

    listHistoryPlayMarkup(list) {
        if (list.length === 0) {
            return `
            <table class="table table__list-history js-list-history-table">
                <thead class="thead-light">
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col" class="text-center">Trò chơi</th>
                        <th scope="col" class="text-center">Từ kiểm tra</th>
                        <th scope="col" class="text-center">Ngày hoàn thành</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="3"><p class="text-info text-center mt-3"> Không tìm thấy kết quả </p></td>
                    </tr>
                </tbody>
            </table> 
            `
        }

        const markupList = list.map((el, index) => {
            if (index >= 100) return ``
            return `
            <tr>
                <th scope="row" >${index + 1}</th>
                <td class="text-${el.game.difficulty} text-center">${el.game.title}</td>
                <td class="text-center">${el.numberOfTest}/${el.numberOfWord}</td>
                <td class="text-center">${el.dateCompleted}</td>
            </tr>
        `
        }).join('')
        return `
        <table class="table table__list-history js-list-history-table">
            <thead class="thead-light">
                <tr>
                    <th scope="col">STT</th>
                    <th scope="col" class="text-center">Trò chơi</th>
                    <th scope="col" class="text-center">Từ kiểm tra</th>
                    <th scope="col" class="text-center">Ngày hoàn thành</th>
                </tr>
            </thead>
            <tbody>
                ${markupList}
            </tbody>
        </table> 
    `
    }

    filterHistoryPlayMarkup(list) {
        const gameMarkup = list.map((el) => {
            return `
                <option class="text-${el.difficulty}" value="${el._id}">${el.title}</option>    
            `
        }).join('')
        return `
            <form class="js-filter-history-game ml-4">
                <h5>Lọc lịch sử</h5>
                <div class="form-group mt-4">
                    <select class="form-control" id="selectGameHistory" style="width: 70%;" >
                        <option value="0">-- Tất cả trò chơi -- </option>
                        ${gameMarkup}
                    </select>
                </div>
                <div class="form-group">
                    <label for="">Từ</label>
                    <input type="date" class="form-control " id="inputDateFromFilter" style="width: 50%;">
                </div>
                <div class="form-group">
                    <label for="">Đến</label>
                    <input type="date" class="form-control " id="inputDateToFilter" style="width: 50%;">
                </div>
                <button type="submit" class="btn btn-primary mt-2" style="width: 20%;">Lọc</button>
            </form>
        `
    }
}

export default new MainMarkup()