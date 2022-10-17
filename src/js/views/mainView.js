
class MainMarkup {
    // OK
    listHistoryPlayMarkup(list) {
        // const length = list.length
        // let derseList = []
        // for (let i = length - 1; i >= length - 100; i--) {
        //     if (i < 0) break
        //     derseList.push(list[i])
        // }
        const markupList = list.map((el) => {
            return `
            <tr>
                <td class="text-${el.game.difficulty} text-center">${el.game.title}</td>
                <td class="text-center">${el.numberOfTest}/${el.numberOfWord}</td>
                <td class="text-center">${el.dateCompleted}</td>
            </tr>
        `
        }).join('')
        return `
        <table class="table js-list-history-table">
            <thead>
                <tr>
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
}

export default new MainMarkup()