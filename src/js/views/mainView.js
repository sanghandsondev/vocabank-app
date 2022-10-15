
class MainMarkup {

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


}

export default new MainMarkup()