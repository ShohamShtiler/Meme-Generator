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
        txt: 'Add Text Here',
        size: 20,
        color: '#FFFFFF',
    }
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
    const canvas = document.getElementById('meme-canvas');
    renderMeme(canvas)
}

function onLineClick(event) {
    const canvas = document.getElementById('meme-canvas')
    const x = event.offsetX
    const y = event.offsetY

    for (let i = 0; i < gMeme.lines.length; i++) {
        const line = gMeme.lines[i]
        const isInLine = x >= line.x - line.width / 2 && x <= line.x + line.width / 2
            && y >= line.y - line.size && y <= line.y + line.size
        if (isInLine) {
            gMeme.selectedLineIdx = i
            renderMeme(canvas)
            updateEditor()
            break
        }
    }
}

function onSwitchLine() {
    if (!gMeme.lines.length) return

    gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length

    const selectedLine = gMeme.lines[gMeme.selectedLineIdx]
    document.getElementById('text-input').value = selectedLine.txt

    onRenderMeme()
}

function onDeleteLine() {
    const selectedLineIdx = gMeme.selectedLineIdx
    if (selectedLineIdx === null || selectedLineIdx < 0 || selectedLineIdx >= gMeme.lines.length) {
        console.error('invalid or no selected line')
        return
    }
    gMeme.lines.splice(selectedLineIdx, 1)
    gMeme.selectedLineIdx = gMeme.lines.length > 0 ? 0 : null
    const canvas = document.getElementById('meme-canvas')
    renderMeme(canvas)

}

function onFontSizeChange(size) {
    const selectedLineIdx = gMeme.selectedLineIdx
    if (selectedLineIdx === null || selectedLineIdx < 0 || selectedLineIdx >= gMeme.lines.length) {
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

function onFontFamilyChange(fontFamily) {
    const selectedLineIdx = gMeme.selectedLineIdx
    if (selectedLineIdx === null || selectedLineIdx < 0 || selectedLineIdx >= gMeme.lines.length) {
        console.error('invalid or no selected line')
        return
    }

    gMeme.lines[selectedLineIdx].fontFamily = fontFamily
    const canvas = document.getElementById('meme-canvas')
    renderMeme(canvas)
}

function onTextAlignChange(alignment) {
    const selectedLineIdx = gMeme.selectedLineIdx
    if (selectedLineIdx === null || selectedLineIdx < 0 || selectedLineIdx >= gMeme.lines.length) {
        console.error('invalid or no selected line')
        return
    }
    gMeme.lines[selectedLineIdx].align = alignment
    const canvas = document.getElementById('meme-canvas')
    renderMeme(canvas)
}

function onSaveMeme() {
    const canvas = document.getElementById('meme-canvas')
    saveMeme(canvas)
    alert('Meme saved!')
}

function onDownloadMeme() {
    const canvas = document.getElementById('meme-canvas')
    const link = document.createElement('a')
    link.download = 'my-meme.png'
    link.href = canvas.toDataURL()
    link.click()
}


function onShareMeme() {

}