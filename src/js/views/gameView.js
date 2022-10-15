
class GameMarkup {
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

    gameMarkup() {

        // g_timeSuggest = TIME_SUGGEST_GAME_1
        // g_timeLive = TIME_LIVE_GAME_1
        return `
        <h3 >Trò chơi </h3>
        <button type="button" class="btn btn-primary js-btn-start-game" data-toggle="modal" data-target="#timeTestModal">
            Bắt đầu trò chơi
        </button>
        
        <div class="js-time-game hidden"> 
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
        <div class="js-game-content">
            
        </div>

    `
    }

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

    game2ContentMarkup(list) {
        // let fakeList = []
        // const length = list.length
        // const random = Math.floor(Math.random() * length)
        // const question = list[random].name

        // console.log(fakeList)
        // console.log(list)


        return `
            <button type="button" class="btn btn-info mt-2" disabled
                id="${random}">
                Câu hỏi: ${list[random].meaning}
            </button>

            <div class="js-form-check-answer-game2 mt-2 ">
                <button type="button" class="btn btn-outline-primary mt-2" style="width:60%;">father</button>
                <br>
                <button type="button" class="btn btn-outline-primary mt-2" style="width:60%;">mother</button>
                <br>
                <button type="button" class="btn btn-outline-primary mt-2" style="width:60%;">sister</button>
                <br>
                <button type="button" class="btn btn-outline-primary mt-2" style="width:60%;">brother</button>
                <br>
            </div>
            <button type="button" class="btn btn-primary mt-2 js-btn-check-answer" >Kiểm tra đáp án</button>
        `
    }
}

export default new GameMarkup()