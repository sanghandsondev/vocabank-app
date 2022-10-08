
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