'use strict'

function renderMemeText(ctx) {
    gMeme.lines.forEach((line) => {
        ctx.font = `${line.size}px Arial`
        ctx.fillStyle = line.color
        ctx.textAlign = 'center'
        ctx.fillText(line.txt, canvas.width / 2, canvas.height / 2)
    })
}