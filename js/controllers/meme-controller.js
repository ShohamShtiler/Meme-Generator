'use strict'
let isDragging = false
let dragStartPose = null

function onRenderMeme() {
    const canvas = document.getElementById('meme-canvas')
    renderMeme(canvas)
}

function onTextChange(text) {
    gMeme.lines[gMeme.selectedLineIdx].txt = text
    onRenderMeme()
}

function onAddText() {
    // Handling the user click, creating the relevant line or object, and then sending this object to the service
    const newLine = {
        txt: 'Add Text Here',
        size: 20,
        color: '#FFFFFF',
    }
    addText(newLine)
    onRenderMeme()
}

//Line Rendering
function renderLine(ctx, line, idx, canvas) {
    ctx.font = `${line.size}px ${line.fontFamily || 'Arial'}`
    ctx.fillStyle = line.color
    ctx.textAlign = line.align || 'center'

    const xPos = line.x || canvas.width / 2
    const yPos = line.y || (canvas.height / (gMeme.lines.length + 1)) * (idx + 1)

    line.x = xPos
    line.y = yPos

    const textWidth = ctx.measureText(line.txt).width
    const textMetrics = ctx.measureText(line.txt)
    const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent

    line.width = textWidth
    line.height = textHeight
    
    
    ctx.fillText(line.txt, xPos, yPos)

    if (idx === gMeme.selectedLineIdx) {
        const framePadding = 5
        ctx.strokeStyle = "black"
        ctx.lineWidth = 2
       
        console.log('color:', ctx.strokeStyle)

        ctx.strokeRect(
            xPos - textWidth / 2 - framePadding,
            yPos - textMetrics.actualBoundingBoxAscent - framePadding,
            textWidth + framePadding * 2,
            textHeight + framePadding * 2,
        )
    }
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
    onRenderMeme()
}

function onFontSizeChange(size) {
    const selectedLineIdx = gMeme.selectedLineIdx
    if (selectedLineIdx === null || selectedLineIdx < 0 || selectedLineIdx >= gMeme.lines.length) {
        console.error('invalid or no selected line')
        return
    }

    gMeme.lines[selectedLineIdx].size = size
    onRenderMeme()
}

function onFontColorChange(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
    onRenderMeme()
}

function onFontFamilyChange(fontFamily) {
    const selectedLineIdx = gMeme.selectedLineIdx
    if (selectedLineIdx === null || selectedLineIdx < 0 || selectedLineIdx >= gMeme.lines.length) {
        console.error('invalid or no selected line')
        return
    }

    gMeme.lines[selectedLineIdx].fontFamily = fontFamily
    onRenderMeme()
}

function onTextAlignChange(alignment) {
    const selectedLineIdx = gMeme.selectedLineIdx
    if (selectedLineIdx === null || selectedLineIdx < 0 || selectedLineIdx >= gMeme.lines.length) {
        console.error('invalid or no selected line')
        return
    }
    gMeme.lines[selectedLineIdx].align = alignment
    onRenderMeme()
}

function onSaveMeme() {
    const canvas = document.getElementById('meme-canvas')
    saveMeme(canvas)
    alert('Meme saved!')
}


function onSavedMemeClick(memeIdx) {
    const savedMemes = getSavedMemes()
    const meme = savedMemes[memeIdx]
    if (!meme) return

    gMeme = meme.memeData
    onRenderMeme()
    window.location.hash = 'meme'
}

function onDeleteSavedMeme(event, memeIdx) {
    event.stopPropagation()
    const savedMemes = getSavedMemes()
    savedMemes.splice(memeIdx, 1)
    saveToStorage('savedMemes', savedMemes)
    renderSavedMemes()

}

function onDownloadMeme() {
    const canvas = document.getElementById('meme-canvas')
    const link = document.createElement('a')
    link.download = 'my-meme.png'
    link.href = canvas.toDataURL()
    link.click()
}

function onFlexibleMeme() {
    const randomIdx = getRandomInt(0, gImgs.length)
    const randomImg = gImgs[randomIdx]

    const randomTexts = [
        'Just do it!',
        'Stay Hungry, Stay Foolish',
        'YOLO!',
        'Live Laugh Love',
        'I am the one who knocks!',
        'Keep Calm and Carry On'
    ]

    const randomText = randomTexts[getRandomInt(0, randomTexts.length)]
    const randomColor = getRandomColor()

    gMeme = {
        selectedImgId: randomImg.id,
        selectedLineIdx: 0,
        lines: [
            {
                txt: randomText,
                size: 40,
                color: randomColor,
            }
        ]
    }
    onRenderMeme()
    window.location.hash = 'meme'
}

function addCanvasEventListeners() {
    const canvas = document.getElementById('meme-canvas')
    canvas.addEventListener('mousedown', onDragStart)
    canvas.addEventListener('mousemove', onDragMove)
    canvas.addEventListener('mouseup', onDragEnd)
    canvas.addEventListener('mouseleave', onDragEnd)

    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)
}

function onDragStart(event) {
    const canvas = document.getElementById('meme-canvas')
    const { offsetX, offsetY } = event

    const clickedLineIdx = gMeme.lines.findIndex(line =>
        isWithinLineBounds(line, offsetX, offsetY, canvas))

    if (clickedLineIdx !== -1)
        gMeme.selectedLineIdx = clickedLineIdx
    isDragging = true
    dragStartPose = { x: offsetX, y: offsetY }
    canvas.style.cursor = 'grabbing'

    console.log('Drag started:', dragStartPose, 'Line index:', clickedLineIdx)
}

function onDragMove(event) {
    if (!isDragging) return

    const canvas = document.getElementById('meme-canvas')
    const { offsetX, offsetY } = event
    const dx = offsetX - dragStartPose.x
    const dy = offsetY - dragStartPose.y

    const selectedLine = gMeme.lines[gMeme.selectedLineIdx]
    if (selectedLine) {
        selectedLine.x += dx
        selectedLine.y += dy

        dragStartPose = { x: offsetX, y: offsetY }
        onRenderMeme()
    }
}

function onDragEnd() {
    const canvas = document.getElementById('meme-canvas')

    if (isDragging) {
        isDragging = false
        canvas.style.cursor = 'default'
        onRenderMeme()
    }
    console.log('Drag ended.')
}

function onTouchStart(event) {
    event.preventDefault()
    const touch = event.touches[0]
    const canvas = event.target

    const rect = canvas.getBoundingClientRect()
    const offsetX = touch.clientX - rect.left
    const offsetY = touch.clientY - rect.top

    const simulatedMouseEvent = {
        offsetX,
        offsetY,
        target: canvas
    }
    onDragStart(simulatedMouseEvent)
}

function onTouchMove(event) {
    event.preventDefault()
    const touch = event.touches[0]
    const canvas = event.target

    const rect = canvas.getBoundingClientRect()
    const offsetX = touch.clientX - rect.left
    const offsetY = touch.clientY - rect.top

    const simulatedMouseEvent = {
        offsetX,
        offsetY,
        target: canvas
    }
    onDragMove(simulatedMouseEvent)
}

function onTouchEnd(event) {
    event.preventDefault()
    onDragEnd()
}

function isWithinLineBounds(line, x, y, canvas) {
    const ctx = canvas.getContext('2d')
    ctx.font = `${line.size}px ${line.fontFamily || 'Arial'}`
    const textWidth = ctx.measureText(line.txt).width
    const textHeight = line.size

    const lineXStart = line.x - textWidth / 2
    const lineXEnd = line.x + textWidth / 2
    const lineYStart = line.y - textHeight / 2
    const lineYEnd = line.y + textHeight / 2

    return x >= lineXStart && x <= lineXEnd && y >= lineYStart && y <= lineYEnd

}