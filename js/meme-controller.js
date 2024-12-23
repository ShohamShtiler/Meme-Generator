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
    const newLine = {
        txt:'Add Text Here',
        size: 20,
        color:'white',
    }
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
    const canvas = document.getElementById('meme-canvas');
    renderMeme(canvas)
}

function onSwitchLine() {
    if (!gMeme.lines.length) return

    gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length

    const selectedLine = gMeme.lines[gMeme.selectedLineIdx]
    document.getElementById('text-input').value = selectedLine.txt

    onRenderMeme()
}

function onFontSizeChange(size) {
    const selectedLineIdx = gMeme.selectedLineIdx
    if(selectedLineIdx === null || selectedLineIdx < 0 || selectedLineIdx >= gMeme.lines.length) {
        console.error('invalid or no selected line') 
        return
    }

    gMeme.lines[selectedLineIdx].size = size
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