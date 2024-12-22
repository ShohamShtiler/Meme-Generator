'use strict'

function onInit() {
    handleRouting()
    renderGallery()

    window.addEventListener('hashchange', () => {
        handleRouting()

        if (window.location.hash.slice(1) === 'saved') {
            renderSavedMemes()
        }
    })

}

function renderGallery() {
    const elGallery = document.querySelector('.main-gallery')
    const imgsHTML = gImgs
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
            (meme) =>
                `<div class="saved-item">
                    <img src="${meme.img}" alt="Saved Meme">
                 </div>`
        )
        .join('')
    elSaved.innerHTML = savedHTML
}

function onPictureClick(imgId) {
    gMeme.selectedImgId = imgId
    const canvas = document.getElementById('meme-canvas')
    const ctx = canvas.getContext('2d')

    loadPictureToCanvas(ctx, canvas)
    window.location.hash = 'meme'
}