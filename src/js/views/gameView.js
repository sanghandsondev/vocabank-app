
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


        return `
        <button type="button" class="btn btn-primary js-btn-start-game" data-toggle="modal" data-target="#timeTestModal">
            Bắt đầu trò chơi
        </button>
        <div class="js-time-game hidden"> 
            <button type="button" class="btn btn-outline-primary js-time-test-display" disabled>
                Từ kiểm tra:
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

    noteGameMarkup() {
        return `
            <div class="mx-3 js-list-note-game">
                
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
        let fakeList = []
        const length = list.length
        const random = Math.floor(Math.random() * length)
        const question = list[random].meaning
        const answer = list[random].name
        let newList = list.filter((el) => {
            return el.meaning !== question
        })
        // Choose 3 fake answer
        let random3 = Math.floor(Math.random() * 4) // các vị trí bất kì trong fakeList
        let random2
        let fakeAnswer
        for (let i = 0; i < 4; i++) {
            if (i === random3) {
                fakeList.push(answer)
                continue
            }
            random2 = Math.floor(Math.random() * newList.length)
            fakeAnswer = newList[random2].name
            fakeList.push(fakeAnswer)
            newList.splice(random2, 1)
        }
        // render
        const markup = fakeList.map((el, index) => {
            return `
                <div class="form-check mt-2">
                    <input class="form-check-input" type="radio" name="answer" hidden value="${el}">
                    <button type="button" class="btn btn-outline-primary js-answer-${index + 1}" style="width:60%">
                            ${el}
                    </button>
                </div>
         `
        }).join('')

        return `
            <button type="button" class="btn btn-info mt-2" disabled>
                Câu hỏi: ${question}
            </button>

            <form class="js-form-check-answer-game2 mt-2 ">
                ${markup}
                     
                <button id="${random}" type="submit" class="btn btn-primary mt-3 ml-3 js-btn-check-answer" >Kiểm tra đáp án</button>
            </form>
        `
    }

    game3ContentMarkup(list, number) {
        let gameList = []
        let randomWord
        let newList = []
        list.forEach(element => {
            newList.push(element)
        });
        for (let i = 0; i < number; i++) {
            randomWord = Math.floor(Math.random() * newList.length)
            gameList.push(newList[randomWord].name)
            gameList.push(newList[randomWord].meaning)
            newList.splice(randomWord, 1)
        }
        // console.log(gameList)
        let randomLocation
        let gameListRandom = []
        const length = gameList.length
        for (let i = 0; i < length; i++) {
            randomLocation = Math.floor(Math.random() * gameList.length)
            gameListRandom.push(gameList[randomLocation])
            gameList.splice(randomLocation, 1)
        }
        // console.log(gameListRandom)
        const markup = gameListRandom.map((el) => {
            return `
            <button type="button" class="btn btn-outline-primary mt-1" style="width:24%;height:56px;overflow: hidden;user-select: none;">
                    <span class="hidden">${el}</span>
            </button>
            `
        }).join('')
        return `
            <div class="mt-2 js-list-answer-game3" style="user-select: none;">
                ${markup}
            </div>
        `
    }
}

export default new GameMarkup()