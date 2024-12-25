'use strict'

function handleRouting() {
  const route = window.location.hash.slice(1)
  if (route === 'gallery') {
    showGallery()
  } else if (route === 'meme') {
    showMemeEditor()
  } else if (route === 'saved') {
    showSavedMemes()
  } else if (route === 'about') {
    showAbout()
  } else {
    showGallery()
  }
}

function showGallery() {
  document.querySelector('.main-gallery').style.display = 'grid'
  document.querySelector('.meme-editor').style.display = 'none'
  document.querySelector('.saved').style.display = 'none'
  document.querySelector('.about').style.display = 'none'
}

function showMemeEditor() {
  document.querySelector('.main-gallery').style.display = 'none'
  document.querySelector('.meme-editor').style.display = 'block'
  document.querySelector('.saved').style.display = 'none'
  document.querySelector('.about').style.display = 'none'

}

function showSavedMemes() {
  document.querySelector('.main-gallery').style.display = 'none'
  document.querySelector('.meme-editor').style.display = 'none'
  document.querySelector('.about').style.display = 'none'
  document.querySelector('.saved').style.display = 'grid'
}

function  showAbout() {
  document.querySelector('.main-gallery').style.display = 'none'
  document.querySelector('.meme-editor').style.display = 'none'
  document.querySelector('.saved').style.display = 'none'
  document.querySelector('.about').style.display = 'block'

}

function toggleMenu() {
  document.body.classList.toggle('menu-open');
}