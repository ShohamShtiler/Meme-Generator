'use strict'

function onInit() {
    const canvas = document.getElementById('meme-canvas')
    canvas.addEventListener('click', onLineClick)

    handleRouting()
    renderGallery()

    window.addEventListener('hashchange', () => {
        handleRouting()

        if (window.location.hash.slice(1) === 'saved') {
            renderSavedMemes()
        }
    })

}

function renderGallery( imgs = gImgs) {
    const elGallery = document.querySelector('.main-gallery')
    

    const imgsHTML = imgs
        .map(
            (img) =>
                `<div class="gallery-item" onclick="onPictureClick(${img.id})">
                  <img src="${img.url}" alt="Picture ${img.id}">
                </div>`
        )
        .join('')
    elGallery.innerHTML = imgsHTML
}

function renderSavedMemes() {
    const savedMemes = getSavedMemes()
    const elSaved = document.querySelector('.saved')
    const savedHTML = savedMemes
        .map(
            (meme, idx) =>
                `<div class="saved-item">
                    <img src="${meme.img}" alt="Saved Meme" onclick="onSavedMemeClick(${idx})">
                    <button class="delete-btn" onclick= "onDeleteSavedMeme(event, ${idx})">Delete<button>
                 </div>`
        )
        .join('')
    elSaved.innerHTML = savedHTML
}

function onPictureClick(imgId) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'Add Text Here',
                size: 40,
                color: '#FFFFFF',
            }
        ]
    }

    const canvas = document.getElementById('meme-canvas')
    renderMeme(canvas)
    window.location.hash = 'meme'
}

function onFilterGallery() {
    const filterValue = document.getElementById('filter-input').value.toLowerCase()

    const filteredImgs = gImgs.filter(img =>
        img.keywords.some(keyword => keyword.toLowerCase().includes(filterValue))
    )
    renderGallery(filteredImgs)
}