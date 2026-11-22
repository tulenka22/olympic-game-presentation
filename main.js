import Reveal from 'reveal.js'
import RevealNotes from 'reveal.js/plugin/notes'
import QRCode from 'qrcode'
import 'reveal.js/reveal.css'
import './theme.css'

const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173/'
const SHORT_URL = import.meta.env.VITE_SHORT_URL || 'localhost:5173'

let leaving = false

function appUrl() {
  const url = new URL(APP_URL, window.location.href)
  url.searchParams.set('demo', '1')
  return url.href
}

function goToApp() {
  if (leaving) return
  leaving = true

  const target = appUrl()
  const sameOrigin = new URL(target).origin === window.location.origin

  // Cross-document View Transitions only work inside one origin. The deck is
  // on GitHub Pages and the app is on olympic-game.ru, so that path falls back
  // to the short fade. If the deck is later proxied under the app domain, the
  // transition starts working automatically.
  const supportsViewTransition =
    sameOrigin &&
    import.meta.env.PROD &&
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('view-transition-name: root')

  if (supportsViewTransition) {
    window.location.assign(target)
    return
  }

  document.body.classList.add('is-handing-off')
  window.setTimeout(() => window.location.assign(target), 340)
}

function isLastSlide() {
  return typeof Reveal.isLastSlide === 'function'
    ? Reveal.isLastSlide()
    : Reveal.getIndices().h === Reveal.getTotalSlides() - 1
}

async function setupQr() {
  const canvas = document.getElementById('qr-canvas')
  const shortUrl = document.getElementById('short-url')
  if (shortUrl) shortUrl.textContent = SHORT_URL
  if (!canvas) return

  try {
    await QRCode.toCanvas(canvas, appUrl(), {
      width: 320,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#0b1119', light: '#fff8e7' },
    })
  } catch (error) {
    console.warn('QR code could not be rendered:', error)
  }
}

document.getElementById('open-app')?.addEventListener('click', goToApp)

// Last slide: the next arrow is not another slide, it is the app hand-off.
document.addEventListener(
  'keydown',
  (event) => {
    if (!isLastSlide()) return
    const keys = ['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    event.stopPropagation()
    goToApp()
  },
  true,
)

let touchStart = null
document.querySelector('.reveal')?.addEventListener('touchstart', (event) => {
  if (!isLastSlide()) return
  touchStart = { x: event.touches[0]?.clientX ?? 0, y: event.touches[0]?.clientY ?? 0 }
}, { passive: true })

document.querySelector('.reveal')?.addEventListener('touchend', (event) => {
  if (!isLastSlide() || !touchStart) return
  const touch = event.changedTouches[0]
  if (!touch) return
  const dx = touch.clientX - touchStart.x
  const dy = touch.clientY - touchStart.y
  if (dx < -55 && Math.abs(dx) > Math.abs(dy)) goToApp()
  touchStart = null
}, { passive: true })

Reveal.initialize({
  hash: true,
  history: true,
  controls: true,
  controlsTutorial: false,
  progress: true,
  slideNumber: 'c/t',
  transition: 'fade',
  transitionSpeed: 'fast',
  backgroundTransition: 'fade',
  center: false,
  // 16:9 fills a standard projector/laptop display. On other aspect ratios
  // Reveal keeps dark letterbox bars instead of a white frame.
  width: 1600,
  height: 900,
  margin: 0,
  minScale: 0.2,
  maxScale: 1.4,
  plugins: [RevealNotes],
}).then(setupQr)
