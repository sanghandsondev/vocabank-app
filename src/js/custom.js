
export const showToast = (message, type) => {

    const main = document.getElementById('my-toast')
    if (!main) return
    const toast = document.createElement('div')

    toast.classList.add('my-toast', `my-toast--${type}`)
    toast.style.animation = `slideInLeft ease .3s, fadeOut linear .5s 2s forwards`;
    toast.innerText = message
    main.appendChild(toast)
    const autoRemove = setTimeout(() => {
        main.removeChild(toast)
    }, 2000 + 500 + 2000)
    toast.addEventListener('click', (e) => {
        main.removeChild(toast)
        clearTimeout(autoRemove)
    })
}

export const setTimeDisplay = (timeIn1000Second) => {
    const second = 1000
    const minute = second * 60
    const hour = minute * 60
    // String hay Number đều OK
    let textHour = Math.floor(timeIn1000Second / hour)
    textHour = textHour < 10 ? `0${textHour}` : textHour
    let textMinute = Math.floor((timeIn1000Second % hour) / minute)
    textMinute = textMinute < 10 ? `0${textMinute}` : textMinute
    let textSecond = Math.floor((timeIn1000Second % minute) / second)
    textSecond = textSecond < 10 ? `0${textSecond}` : textSecond

    document.querySelector('.js-hour-display').innerText = textHour
    document.querySelector('.js-minute-display').innerText = textMinute
    document.querySelector('.js-second-display').innerText = textSecond

    // return { hour: textHour, minute: textMinute, second: textSecond }
}

export const readImg = (input, imgSrc) => {
    if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
            document.querySelector(imgSrc).src = e.target.result
        }
        reader.readAsDataURL(input.files[0])
    }
}

export const addNoteWordInGame = (firstEl, secondEl) => {
    let pp = document.createElement('p')
    pp.classList.add('fix-line-list-note-game')
    pp.innerHTML = `
                - ${firstEl} : ${secondEl}
            `
    // const markup = `
    //     <p class="fix-line-list-note-game">
    //         - ${firstEl} : ${secondEl}
    //     </p>
    // `
    document.querySelector('.js-list-note-game').insertAdjacentElement('afterbegin', pp)
}

