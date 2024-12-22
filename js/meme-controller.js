'use strict'

function onRenderMeme() {
    const canvas = document.getElementById('meme-canvas')
    renderMeme(canvas)
}

function onTextChange(text) {
    gMeme.lines[gMeme.selectedLineIdx].txt = text
    const canvas = document.getElementById('meme-canvas')
    renderMeme(canvas)
}

function onAddText() {
    const canvas = document.getElementById('meme-canvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    const newLine = {
        txt:'Add Text Here',
        size: 20,
        color:'#000',
    }
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
    renderMeme(canvas)
}

function onFontSizeChange(size) {
    gMeme.lines[gMeme.selectedLineIdx].size = size
    const canvas = document.getElementById('meme-canvas')
    renderMeme(canvas)
}

function onFontColorChange(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
    const canvas = document.getElementById('meme-canvas')
    renderMeme(canvas)
}

function onSaveMeme() {
    const canvas = document.getElementById('meme-canvas')
    saveMeme(canvas)
    alert('Meme saved!')
}

function onDownloadMeme () {
    const canvas = document.getElementById('meme-canvas')
    const link = document.createElement('a')
    link.download = 'my-meme.png'
    link.href = canvas.toDataURL()
    link.click()
}

function onShareMeme() {
    
}