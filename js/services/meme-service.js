'use strict'

var gImgs = [
    { id: 1, url: 'images/1.jpg', keywords: ['funny', 'cat'] },
    { id: 2, url: 'images/2.jpg', keywords: ['funny', 'cat'] },
    { id: 3, url: 'images/3.jpg', keywords: ['funny', 'cat'] },
    { id: 4, url: 'images/4.jpg', keywords: ['funny', 'cat'] },
    { id: 5, url: 'images/5.jpg', keywords: ['funny', 'cat'] },
    { id: 6, url: 'images/6.jpg', keywords: ['funny', 'cat'] },
    { id: 7, url: 'images/7.jpg', keywords: ['funny', 'cat'] },
    { id: 8, url: 'images/8.jpg', keywords: ['funny', 'cat'] },
]

var gMeme = {
    selectedImgId: null,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Add Text Here',
            size: 40,
            color: 'white',
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
    ctx.font = `${line.size}px Arial`
    ctx.fillStyle = line.color
    ctx.textAlign = 'center'

    const totalLines = gMeme.lines.length
    const lineSpacing = canvas.height / (totalLines + 1)
    const yPos = lineSpacing * (idx + 1)
    const xPos = canvas.width / 2

    ctx.fillText(line.txt, xPos, yPos)

    if (idx === gMeme.selectedLineIdx) {
        const textWidth = ctx.measureText(line.txt).width

        const framePadding = 5
        const frameHeight = line.size * 1.2 + framePadding * 2
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
        
        ctx.strokeRect(
            xPos - textWidth / 2 - framePadding,
            yPos - line.size * 1,
            textWidth + framePadding * 2,
            frameHeight
        )
    }
}







