'use strict'

var gImgs = [
    { id: 1, url: 'images/1.jpg', keywords: ['The flintstones'] },
    { id: 2, url: 'images/2.jpg', keywords: ['Tom & Jerry'] },
    { id: 3, url: 'images/3.jpg', keywords: ['Popeye'] },
    { id: 4, url: 'images/4.jpg', keywords: ['Bugs Bunny'] },
    { id: 5, url: 'images/5.jpg', keywords: ['the sylvester & tweety mysteries'] },
    { id: 6, url: 'images/6.jpg', keywords: ['The flintstones'] },
    { id: 7, url: 'images/7.jpg', keywords: ['The Pink Panther'] },
    { id: 8, url: 'images/8.jpg', keywords: ['Tom & Jerry'] },
    { id: 9, url: 'images/9.jpg', keywords: ['Bugs Bunny'] },
    { id: 10, url: 'images/10.jpg', keywords: ['Tom & Jerry'] },
    { id: 11, url: 'images/11.jpg', keywords: ['Bugs Bunny'] },
    { id: 12, url: 'images/12.jpg', keywords: ['Bugs Bunny'] },
    { id: 13, url: 'images/13.jpg', keywords: ['Tom & Jerry'] },
    { id: 14, url: 'images/14.jpg', keywords: ['The Pink Panther'] },
    { id: 15, url: 'images/15.jpg', keywords: ['Scooby Doo'] },
    { id: 16, url: 'images/16.jpg', keywords: ['Tom & Jerry'] },
    { id: 17, url: 'images/17.jpg', keywords: ['Yogi Bear'] },
    { id: 18, url: 'images/18.jpg', keywords: ['Daffy Duck'] },
    { id: 19, url: 'images/19.jpg', keywords: ['Daffy Duck'] },
    { id: 20, url: 'images/20.jpg', keywords: ['Popeye'] },
]

var gMeme = {
    selectedImgId: null,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Add Text Here',
            size: 40,
            color: '#FFFFFF',
        }
    ]
}

var gSavedMemes = loadFromStorage('savedMemes') || []

//Meme Rendering
function renderMeme(canvas) {

    if (!canvas) return console.error('Canvas element not found');

    const ctx = canvas.getContext('2d')
    const img = new Image()

    const selectedImg = gImgs.find((img) => img.id === gMeme.selectedImgId)
    if (!selectedImg) return

    img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0, img.width, img.height)

        gMeme.lines.forEach((line, idx) => {
            renderLine(ctx, line, idx, canvas)
        })
    }
    img.src = selectedImg.url
}

function addText(line) {
    gMeme.lines.push(line)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}


//Keywords Rendering
function renderKeyWords() {
    const keywords = [...new Set(gImgs.flatMap(img => img.keywords))].filter(keyword => keyword)
    const elDatalist = document.getElementById('keywords-datalist')
    elDatalist.innerHTML = keywords.map(keyword => `option value="${keyword}"></option>`).join('')
}


//Meme saving
function saveMeme(canvas) {
    const memeDataUrl = canvas.toDataURL()
    const savedMeme = {
        id: Date.now(),
        img: memeDataUrl,
        memeData: { ...gMeme },
    }
    gSavedMemes.push(savedMeme)
    console.log('Meme saved!', savedMeme)
    saveToStorage('savedMemes', gSavedMemes)
}

function getSavedMemes() {
    return gSavedMemes
}

//Meme Editor Update
function updateEditor() {
    if (!gMeme.lines.length) return


    const line = gMeme.lines[gMeme.selectedLineIdx]
    const textInput = document.getElementById('text-input')
    textInput.value = line.txt || ''
    document.getElementById('font-size').value = line.size
    document.getElementById('font-color').value = line.color
}

//Meme Share 
function uploadImg(elForm, ev) {
    ev.preventDefault();
    const canvas = document.getElementById('meme-canvas')
    if (!canvas) {
        console.error('Canvas not found!')
        return
    }

    const dataUrl = canvas.toDataURL("image/jpeg")
    document.querySelector('.img-data').value = dataUrl


    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}`
        window.location.href = facebookShareUrl
    }
    doUploadImg(elForm, onSuccess);
}


function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then((res) => res.text())
        .then(onSuccess)
        .catch((err) => {
            console.error('Image upload failed:', err)
            alert('Failed to upload the image. Please try again.')
        })
}