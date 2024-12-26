'use strict'

var gImgs = [
    { id: 1, url: 'images/1.jpg', keywords: ['funny', ''] },
    { id: 2, url: 'images/2.jpg', keywords: ['dog', ''] },
    { id: 3, url: 'images/3.jpg', keywords: ['baby', 'dog'] },
    { id: 4, url: 'images/4.jpg', keywords: ['', 'cat'] },
    { id: 5, url: 'images/5.jpg', keywords: ['baby', ''] },
    { id: 6, url: 'images/6.jpg', keywords: ['funny', ''] },
    { id: 7, url: 'images/7.jpg', keywords: ['funny', 'baby'] },
    { id: 8, url: 'images/8.jpg', keywords: ['smile', ''] },
    { id: 9, url: 'images/9.jpg', keywords: ['funny', 'baby'] },
    { id: 10, url: 'images/10.jpg', keywords: ['funny', ''] },
    { id: 11, url: 'images/11.jpg', keywords: ['funny', ''] },
    { id: 12, url: 'images/12.jpg', keywords: ['funny', 't'] },
    { id: 13, url: 'images/13.jpg', keywords: ['funny', ''] },
    { id: 14, url: 'images/14.jpg', keywords: ['funny', ''] },
    { id: 15, url: 'images/15.jpg', keywords: ['funny', ''] },
    { id: 16, url: 'images/16.jpg', keywords: ['funny', ''] },
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

function renderKeyWords() {
    const keywords = [...new Set(gImgs.flatMap(img => img.keywords))].filter(keyword => keyword)
    const elDatalist = document.getElementById('keywords-datalist')
    elDatalist.innerHTML = keywords.map(keyword => `option value="${keyword}"></option>`).join('')
}



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

function renderLine(ctx, line, idx, canvas) {
    ctx.font = `${line.size}px ${line.fontFamily || 'Arial'}`
    ctx.fillStyle = line.color
    ctx.textAlign = line.align || 'center'

    const totalLines = gMeme.lines.length
    const lineSpacing = canvas.height / (totalLines + 1)
    const yPos = lineSpacing * (idx + 1)
    const xPos = canvas.width / 2

    line.x = xPos
    line.y = yPos
    line.width = ctx.measureText(line.txt).width
    line.height = line.size + 10

    ctx.fillText(line.txt, xPos, yPos)

    if (idx === gMeme.selectedLineIdx) {
        const framePadding = 5
        const frameHeight = line.size * 1.2 + framePadding * 2
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2

        ctx.strokeRect(
            xPos - line.width / 2 - framePadding,
            yPos - line.size * 1,
            line.width + framePadding * 2,
            frameHeight
        )
    }
}

function updateEditor() {
    if (!gMeme.lines.length) return


    const line = gMeme.lines[gMeme.selectedLineIdx]
    const textInput = document.getElementById('text-input')
    textInput.value = line.txt || ''
    document.getElementById('font-size').value = line.size
    document.getElementById('font-color').value = line.color
}


function uploadImg(elForm, ev) {
    ev.preventDefault();
    const canvas = document.getElementById('meme-canvas')
    if (!canvas) {
        console.error('Canvas not found!')
        return
    }

    const dataUrl = canvas.toDataURL("image/jpeg")
    document.querySelector('.img-data').value = dataUrl


    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`
        window.open(facebookShareUrl, '_blank')
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













