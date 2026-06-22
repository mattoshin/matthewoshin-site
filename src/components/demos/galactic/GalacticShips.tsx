"use client"

import { useEffect, useRef } from "react"

/**
 * GalacticShips - the animated cosmic background ported verbatim from the real
 * Galactic Signals product (galacticsignals.com). A single self-contained Canvas
 * 2D scene (no Three.js, no libraries, no image assets): twinkling stars, drifting
 * planets, shooting stars, and little starships from two teams that fire lasers and
 * explode on hit. Sits fixed behind the demo landing's z-10 content overlay.
 */
export function GalacticShips() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    const dpr = window.devicePixelRatio || 1
    let w = canvas.clientWidth || window.innerWidth
    let h = canvas.clientHeight || window.innerHeight

    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    // ── Stars ──────────────────────────────────────────

    interface Star {
      x: number
      y: number
      size: number
      opacity: number
      twinkleSpeed: number
      twinkleOffset: number
    }

    const stars: Star[] = []
    const starCount = Math.floor((w * h) / 1800)
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 2 + 0.3,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
      })
    }

    // ── Planets (static, sparsely placed) ──────────────

    interface Planet {
      x: number
      y: number
      radius: number
      color1: string
      color2: string
      ringColor: string | null
      ringTilt: number
      glowColor: string
      glowSize: number
    }

    const planetConfigs = [
      { color1: "#1e3a5f", color2: "#0d1b2a", ringColor: "rgba(100, 180, 255, 0.12)", glowColor: "rgba(56, 189, 248, 0.08)" },
      { color1: "#4a1942", color2: "#1a0a1a", ringColor: null, glowColor: "rgba(168, 85, 247, 0.06)" },
      { color1: "#1a3c34", color2: "#0a1f1a", ringColor: "rgba(45, 212, 191, 0.1)", glowColor: "rgba(45, 212, 191, 0.06)" },
      { color1: "#3d2b1f", color2: "#1a1008", ringColor: null, glowColor: "rgba(251, 146, 60, 0.05)" },
      { color1: "#2d1b4e", color2: "#110a20", ringColor: "rgba(192, 132, 252, 0.08)", glowColor: "rgba(139, 92, 246, 0.06)" },
    ]

    const planets: Planet[] = []
    // Place 4-7 planets scattered across the viewport (more on wider screens)
    const basePlanets = w > 2500 ? 5 : 3
    const planetCount = basePlanets + Math.floor(Math.random() * 3)
    for (let i = 0; i < planetCount; i++) {
      const cfg = planetConfigs[i % planetConfigs.length]
      planets.push({
        x: w * 0.08 + Math.random() * w * 0.84,
        y: h * 0.1 + Math.random() * h * 0.8,
        radius: 15 + Math.random() * 35,
        color1: cfg.color1,
        color2: cfg.color2,
        ringColor: cfg.ringColor,
        ringTilt: 0.3 + Math.random() * 0.4,
        glowColor: cfg.glowColor,
        glowSize: 1.8 + Math.random() * 0.8,
      })
    }

    function drawPlanets() {
      for (const p of planets) {
        // Outer glow
        const glow = ctx!.createRadialGradient(p.x, p.y, p.radius * 0.5, p.x, p.y, p.radius * p.glowSize)
        glow.addColorStop(0, p.glowColor)
        glow.addColorStop(1, "transparent")
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.radius * p.glowSize, 0, Math.PI * 2)
        ctx!.fillStyle = glow
        ctx!.fill()

        // Planet body
        const grad = ctx!.createRadialGradient(
          p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.1,
          p.x, p.y, p.radius
        )
        grad.addColorStop(0, p.color1)
        grad.addColorStop(1, p.color2)

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx!.fillStyle = grad
        ctx!.fill()

        // Subtle surface band
        ctx!.beginPath()
        ctx!.ellipse(p.x, p.y + p.radius * 0.1, p.radius * 0.9, p.radius * 0.15, 0, 0, Math.PI * 2)
        ctx!.fillStyle = "rgba(255,255,255,0.03)"
        ctx!.fill()

        // Ring (if applicable)
        if (p.ringColor) {
          ctx!.save()
          ctx!.translate(p.x, p.y)
          ctx!.scale(1, p.ringTilt)
          ctx!.beginPath()
          ctx!.arc(0, 0, p.radius * 1.6, 0, Math.PI * 2)
          ctx!.strokeStyle = p.ringColor
          ctx!.lineWidth = 2
          ctx!.stroke()
          ctx!.beginPath()
          ctx!.arc(0, 0, p.radius * 1.45, 0, Math.PI * 2)
          ctx!.strokeStyle = p.ringColor
          ctx!.lineWidth = 1
          ctx!.stroke()
          ctx!.restore()
        }
      }
    }

    // ── Shooting Stars ─────────────────────────────────

    interface ShootingStar {
      x: number
      y: number
      len: number
      speed: number
      angle: number
      opacity: number
      life: number
      maxLife: number
    }

    const shootingStars: ShootingStar[] = []

    function spawnShootingStar() {
      if (shootingStars.length > 3) return
      const angle = Math.random() * Math.PI * 0.5 + Math.PI * 0.15
      const goLeft = Math.random() > 0.5

      shootingStars.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.4,
        len: Math.random() * 80 + 40,
        speed: Math.random() * 6 + 5,
        angle: goLeft ? Math.PI - angle : angle,
        opacity: 1,
        life: 0,
        maxLife: 50 + Math.random() * 40,
      })
    }

    // ── Starships ──────────────────────────────────────

    interface Ship {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      team: 0 | 1
      life: number
      maxLife: number
      fireTimer: number
      fireRate: number
      angle: number
      variant: number // 0-2 different ship shapes per team
    }

    interface Laser {
      x: number
      y: number
      vx: number
      vy: number
      team: 0 | 1
      life: number
      maxLife: number
    }

    interface Explosion {
      x: number
      y: number
      radius: number
      maxRadius: number
      opacity: number
      particles: { dx: number; dy: number; size: number }[]
    }

    const ships: Ship[] = []
    const lasers: Laser[] = []
    const explosions: Explosion[] = []

    const teamColors = {
      // Team 0: brand teal/cyan. Team 1: brand-aligned to Discord blurple
      // (--g-blurple #5865F2). Only `glow` is rendered (ships draw greyscale).
      0: { ship: "#8ec8c0", laser: "#22d3ee", glow: "rgba(142,200,192," },
      1: { ship: "#a5b4fc", laser: "#5865F2", glow: "rgba(88,101,242," },
    }

    function spawnShip() {
      if (ships.length > 2) return
      const team = (Math.random() > 0.5 ? 1 : 0) as 0 | 1
      const fromLeft = Math.random() > 0.5

      ships.push({
        x: fromLeft ? -30 : w + 30,
        y: h * 0.08 + Math.random() * h * 0.84,
        vx: (fromLeft ? 1 : -1) * (Math.random() * 0.6 + 0.3),
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 6,
        team,
        life: 0,
        maxLife: 500 + Math.random() * 500,
        fireTimer: Math.random() * 60,
        fireRate: 50 + Math.random() * 40,
        angle: fromLeft ? 0 : Math.PI,
        variant: Math.floor(Math.random() * 3),
      })
    }

    function fireLaser(ship: Ship) {
      let target: Ship | null = null
      let minDist = Infinity
      for (const other of ships) {
        if (other.team === ship.team) continue
        const dx = other.x - ship.x
        const dy = other.y - ship.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < minDist && dist < 500) {
          minDist = dist
          target = other
        }
      }
      if (!target) return

      const dx = target.x - ship.x
      const dy = target.y - ship.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      lasers.push({
        x: ship.x,
        y: ship.y,
        vx: (dx / dist) * 4,
        vy: (dy / dist) * 4,
        team: ship.team,
        life: 0,
        maxLife: 50 + Math.random() * 20,
      })
    }

    function spawnExplosion(x: number, y: number) {
      const particles = []
      const count = 6 + Math.floor(Math.random() * 6)
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
        particles.push({
          dx: Math.cos(angle) * (1 + Math.random() * 2),
          dy: Math.sin(angle) * (1 + Math.random() * 2),
          size: 0.5 + Math.random() * 1.5,
        })
      }
      explosions.push({
        x, y,
        radius: 0,
        maxRadius: 18 + Math.random() * 14,
        opacity: 0.7 + Math.random() * 0.3,
        particles,
      })
    }

    // ── Draw ───────────────────────────────────────────

    let frame = 0

    function draw() {
      ctx!.clearRect(0, 0, w, h)
      frame++

      // ─ Planets (behind everything) ─
      drawPlanets()

      // ─ Stars ─
      for (const star of stars) {
        const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinkleOffset) * 0.4 + 0.6
        const alpha = star.opacity * twinkle

        ctx!.beginPath()
        ctx!.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx!.fill()

        if (star.size > 1.2) {
          ctx!.beginPath()
          ctx!.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(45, 212, 191, ${alpha * 0.1})`
          ctx!.fill()
        }
      }

      // ─ Shooting stars ─
      if (frame % 100 === 0 && Math.random() > 0.25) {
        spawnShootingStar()
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i]
        s.life++
        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed
        s.opacity = 1 - s.life / s.maxLife

        if (s.life >= s.maxLife) {
          shootingStars.splice(i, 1)
          continue
        }

        const tailX = s.x - Math.cos(s.angle) * s.len
        const tailY = s.y - Math.sin(s.angle) * s.len
        const gradient = ctx!.createLinearGradient(tailX, tailY, s.x, s.y)
        gradient.addColorStop(0, `rgba(45, 212, 191, 0)`)
        gradient.addColorStop(1, `rgba(255, 255, 255, ${s.opacity})`)

        ctx!.beginPath()
        ctx!.moveTo(tailX, tailY)
        ctx!.lineTo(s.x, s.y)
        ctx!.strokeStyle = gradient
        ctx!.lineWidth = 1.5
        ctx!.stroke()

        ctx!.beginPath()
        ctx!.arc(s.x, s.y, 2, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255, 255, 255, ${s.opacity})`
        ctx!.fill()
      }

      // ─ Spawn ships ─
      if (frame % 600 === 0) {
        spawnShip()
      }

      // ─ Ships ─
      for (let i = ships.length - 1; i >= 0; i--) {
        const ship = ships[i]
        ship.life++
        ship.x += ship.vx
        ship.y += ship.vy
        ship.vy += (Math.random() - 0.5) * 0.02

        // Update angle to face direction of travel
        ship.angle = Math.atan2(ship.vy, ship.vx)

        if (ship.life >= ship.maxLife || ship.x < -60 || ship.x > w + 60) {
          ships.splice(i, 1)
          continue
        }

        // Fire
        ship.fireTimer++
        if (ship.fireTimer >= ship.fireRate) {
          ship.fireTimer = 0
          fireLaser(ship)
        }

        const fadeIn = Math.min(ship.life / 20, 1)
        const fadeOut = Math.min((ship.maxLife - ship.life) / 20, 1)
        const alpha = 0.7 * fadeIn * fadeOut

        const s = ship.size
        const c = ctx!
        const ef = 0.7 + Math.sin(frame * 0.3 + ship.life) * 0.3 // engine flicker

        // Engine exhaust trail glow (in world space, behind ship)
        const cosA = Math.cos(ship.angle)
        const sinA = Math.sin(ship.angle)
        const exBase = ship.x + (-s * 3.5) * cosA
        const eyBase = ship.y + (-s * 3.5) * sinA
        const engGlow = c.createRadialGradient(exBase, eyBase, 0, exBase, eyBase, s * 3)
        engGlow.addColorStop(0, `rgba(180,200,255,${alpha * ef * 0.2})`)
        engGlow.addColorStop(1, `rgba(100,150,255,0)`)
        c.beginPath()
        c.arc(exBase, eyBase, s * 3, 0, Math.PI * 2)
        c.fillStyle = engGlow
        c.fill()

        c.save()
        c.translate(ship.x, ship.y)
        c.rotate(ship.angle)

        if (ship.variant === 0) {
          // ═══ VARIANT 0: MILLENNIUM FALCON ═══
          c.beginPath()
          c.ellipse(0, 0, s * 3.5, s * 2.8, 0, 0, Math.PI * 2)
          const discG = c.createRadialGradient(-s * 0.5, -s * 0.5, s * 0.3, 0, 0, s * 3.5)
          discG.addColorStop(0, `rgba(175,170,160,${alpha * 0.9})`)
          discG.addColorStop(0.3, `rgba(145,140,130,${alpha * 0.85})`)
          discG.addColorStop(0.6, `rgba(120,115,108,${alpha * 0.8})`)
          discG.addColorStop(1, `rgba(85,80,75,${alpha * 0.75})`)
          c.fillStyle = discG
          c.fill()
          c.strokeStyle = `rgba(200,195,185,${alpha * 0.2})`
          c.lineWidth = 0.5
          c.stroke()

          // Hull panel lines
          c.strokeStyle = `rgba(60,55,50,${alpha * 0.2})`
          c.lineWidth = 0.3
          c.beginPath()
          c.ellipse(0, 0, s * 2.2, s * 1.8, 0, 0, Math.PI * 2)
          c.stroke()
          for (let p = 0; p < 8; p++) {
            const pa = (Math.PI * 2 * p) / 8
            c.beginPath()
            c.moveTo(Math.cos(pa) * s * 1.5, Math.sin(pa) * s * 1.2)
            c.lineTo(Math.cos(pa) * s * 3.2, Math.sin(pa) * s * 2.6)
            c.stroke()
          }

          // Forward mandibles
          for (const dir of [-1, 1]) {
            c.beginPath()
            c.moveTo(s * 3.2, dir * s * 0.6)
            c.lineTo(s * 6, dir * s * 0.4)
            c.lineTo(s * 6.5, dir * s * 0.15)
            c.lineTo(s * 6.5, dir * s * 0.05)
            c.lineTo(s * 5.8, dir * s * 0.1)
            c.lineTo(s * 3.5, dir * s * 0.15)
            c.closePath()
            const mandG = c.createLinearGradient(s * 3, dir * s * 0.5, s * 6.5, 0)
            mandG.addColorStop(0, `rgba(140,135,125,${alpha * 0.85})`)
            mandG.addColorStop(0.5, `rgba(160,155,145,${alpha * 0.8})`)
            mandG.addColorStop(1, `rgba(120,115,108,${alpha * 0.7})`)
            c.fillStyle = mandG
            c.fill()
            c.strokeStyle = `rgba(180,175,165,${alpha * 0.15})`
            c.lineWidth = 0.3
            c.stroke()
          }

          // Gap between mandibles
          c.beginPath()
          c.moveTo(s * 3.5, s * 0.1)
          c.lineTo(s * 6, s * 0.05)
          c.lineTo(s * 6, -s * 0.05)
          c.lineTo(s * 3.5, -s * 0.1)
          c.closePath()
          c.fillStyle = `rgba(15,20,30,${alpha * 0.6})`
          c.fill()

          // Raised center pod
          c.beginPath()
          c.ellipse(-s * 0.3, 0, s * 1.8, s * 1.4, 0, 0, Math.PI * 2)
          const podG = c.createRadialGradient(-s * 0.8, -s * 0.4, s * 0.2, -s * 0.3, 0, s * 1.8)
          podG.addColorStop(0, `rgba(185,180,170,${alpha * 0.9})`)
          podG.addColorStop(0.5, `rgba(150,145,138,${alpha * 0.85})`)
          podG.addColorStop(1, `rgba(110,105,100,${alpha * 0.8})`)
          c.fillStyle = podG
          c.fill()
          c.strokeStyle = `rgba(90,85,78,${alpha * 0.2})`
          c.lineWidth = 0.4
          c.stroke()

          // Cockpit tube (starboard)
          c.beginPath()
          c.moveTo(s * 1.5, -s * 2.2)
          c.lineTo(s * 3.2, -s * 2.6)
          c.lineTo(s * 3.8, -s * 2.4)
          c.lineTo(s * 3.8, -s * 2.0)
          c.lineTo(s * 3.2, -s * 1.8)
          c.lineTo(s * 1.5, -s * 1.6)
          c.closePath()
          c.fillStyle = `rgba(130,125,118,${alpha * 0.8})`
          c.fill()
          // Cockpit window
          c.beginPath()
          c.arc(s * 3.5, -s * 2.2, s * 0.25, 0, Math.PI * 2)
          c.fillStyle = `rgba(140,200,230,${alpha * 0.55})`
          c.fill()

          // Radar dish
          c.beginPath()
          c.ellipse(s * 0.5, s * 0.8, s * 0.5, s * 0.35, 0.3, 0, Math.PI * 2)
          c.fillStyle = `rgba(160,155,148,${alpha * 0.7})`
          c.fill()

          // 3 rear engines
          for (let eng = 0; eng < 3; eng++) {
            const ey = (eng - 1) * s * 1.2
            c.beginPath()
            c.arc(-s * 3.3, ey, s * 0.45, 0, Math.PI * 2)
            c.fillStyle = `rgba(50,48,45,${alpha * 0.7})`
            c.fill()
            const flameLen = s * (1.8 + Math.random() * 0.6) * ef
            c.beginPath()
            c.moveTo(-s * 3.3, ey - s * 0.35)
            c.lineTo(-s * 3.3 - flameLen, ey)
            c.lineTo(-s * 3.3, ey + s * 0.35)
            c.closePath()
            const flameG = c.createLinearGradient(-s * 3.3, ey, -s * 3.3 - flameLen, ey)
            flameG.addColorStop(0, `rgba(230,240,255,${alpha * ef * 0.6})`)
            flameG.addColorStop(0.4, `rgba(140,190,240,${alpha * ef * 0.35})`)
            flameG.addColorStop(1, `rgba(40,80,160,0)`)
            c.fillStyle = flameG
            c.fill()
          }

        } else if (ship.variant === 1) {
          // ═══ VARIANT 1: SLEEK FIGHTER ═══

          // Main hull
          c.beginPath()
          c.moveTo(s * 5, 0)
          c.lineTo(s * 3.5, -s * 0.25)
          c.lineTo(s * 1.5, -s * 0.45)
          c.lineTo(-s * 1, -s * 0.55)
          c.lineTo(-s * 2.8, -s * 0.35)
          c.lineTo(-s * 3.2, 0)
          c.lineTo(-s * 2.8, s * 0.35)
          c.lineTo(-s * 1, s * 0.55)
          c.lineTo(s * 1.5, s * 0.45)
          c.lineTo(s * 3.5, s * 0.25)
          c.closePath()
          const bodyG = c.createLinearGradient(-s * 3, -s * 0.5, s * 2, s * 0.5)
          bodyG.addColorStop(0, `rgba(70,80,95,${alpha * 0.85})`)
          bodyG.addColorStop(0.3, `rgba(130,140,155,${alpha * 0.9})`)
          bodyG.addColorStop(0.5, `rgba(175,185,195,${alpha * 0.95})`)
          bodyG.addColorStop(0.7, `rgba(120,130,145,${alpha * 0.85})`)
          bodyG.addColorStop(1, `rgba(60,65,80,${alpha * 0.8})`)
          c.fillStyle = bodyG
          c.fill()
          c.strokeStyle = `rgba(200,210,225,${alpha * 0.2})`
          c.lineWidth = 0.4
          c.stroke()

          // Hull panel lines
          c.strokeStyle = `rgba(40,45,55,${alpha * 0.3})`
          c.lineWidth = 0.3
          c.beginPath()
          c.moveTo(s * 4, 0)
          c.lineTo(-s * 2.5, 0)
          c.stroke()
          for (const px of [s * 2, s * 0.5, -s * 1]) {
            c.beginPath()
            c.moveTo(px, -s * 0.4)
            c.lineTo(px, s * 0.4)
            c.stroke()
          }

          // Swept wings
          for (const dir of [-1, 1]) {
            c.beginPath()
            c.moveTo(s * 1, dir * s * 0.45)
            c.lineTo(-s * 0.5, dir * s * 0.45)
            c.lineTo(-s * 2.5, dir * s * 2.8)
            c.lineTo(-s * 1.5, dir * s * 2.8)
            c.lineTo(s * 0.5, dir * s * 0.8)
            c.closePath()
            const wingG = c.createLinearGradient(0, 0, 0, dir * s * 3)
            wingG.addColorStop(0, `rgba(100,110,125,${alpha * 0.7})`)
            wingG.addColorStop(0.5, `rgba(80,88,100,${alpha * 0.6})`)
            wingG.addColorStop(1, `rgba(55,60,72,${alpha * 0.5})`)
            c.fillStyle = wingG
            c.fill()
            c.strokeStyle = `rgba(160,170,185,${alpha * 0.15})`
            c.lineWidth = 0.3
            c.stroke()
            // Wing tip nav light
            c.beginPath()
            c.arc(-s * 2, dir * s * 2.8, s * 0.15, 0, Math.PI * 2)
            c.fillStyle = dir === -1 ? `rgba(255,80,80,${alpha * 0.8})` : `rgba(80,255,80,${alpha * 0.8})`
            c.fill()
          }

          // Cockpit canopy
          c.beginPath()
          c.ellipse(s * 2.5, 0, s * 0.7, s * 0.3, 0, 0, Math.PI * 2)
          const canopyG = c.createLinearGradient(s * 2, -s * 0.3, s * 2.5, s * 0.2)
          canopyG.addColorStop(0, `rgba(140,200,230,${alpha * 0.5})`)
          canopyG.addColorStop(0.4, `rgba(80,140,180,${alpha * 0.6})`)
          canopyG.addColorStop(1, `rgba(40,80,120,${alpha * 0.5})`)
          c.fillStyle = canopyG
          c.fill()

          // 2 rear engines
          for (const dir of [-1, 1]) {
            const ny = dir * s * 0.6
            c.beginPath()
            c.arc(-s * 3, ny, s * 0.3, 0, Math.PI * 2)
            c.fillStyle = `rgba(45,50,60,${alpha * 0.7})`
            c.fill()
            const flameLen = s * (1.2 + Math.random() * 0.5) * ef
            c.beginPath()
            c.moveTo(-s * 3, ny - s * 0.2)
            c.lineTo(-s * 3 - flameLen, ny)
            c.lineTo(-s * 3, ny + s * 0.2)
            c.closePath()
            const flameG = c.createLinearGradient(-s * 3, ny, -s * 3 - flameLen, ny)
            flameG.addColorStop(0, `rgba(220,235,255,${alpha * ef * 0.6})`)
            flameG.addColorStop(0.4, `rgba(100,180,220,${alpha * ef * 0.4})`)
            flameG.addColorStop(1, `rgba(60,120,180,0)`)
            c.fillStyle = flameG
            c.fill()
          }

        } else {
          // ═══ VARIANT 2: HEAVY FREIGHTER ═══

          // Central fuselage pod
          c.beginPath()
          c.moveTo(s * 2, 0)
          c.bezierCurveTo(s * 2, -s * 1.2, -s * 1.5, -s * 1.4, -s * 2.5, -s * 0.6)
          c.lineTo(-s * 2.8, 0)
          c.lineTo(-s * 2.5, s * 0.6)
          c.bezierCurveTo(-s * 1.5, s * 1.4, s * 2, s * 1.2, s * 2, 0)
          c.closePath()
          const hullG = c.createRadialGradient(s * 0.3, -s * 0.3, s * 0.2, 0, 0, s * 2)
          hullG.addColorStop(0, `rgba(140,135,150,${alpha * 0.9})`)
          hullG.addColorStop(0.4, `rgba(90,85,100,${alpha * 0.85})`)
          hullG.addColorStop(1, `rgba(45,42,55,${alpha * 0.8})`)
          c.fillStyle = hullG
          c.fill()
          c.strokeStyle = `rgba(170,165,180,${alpha * 0.2})`
          c.lineWidth = 0.4
          c.stroke()

          // Hull seams
          c.strokeStyle = `rgba(35,32,45,${alpha * 0.25})`
          c.lineWidth = 0.3
          c.beginPath()
          c.moveTo(s * 1.5, 0)
          c.lineTo(-s * 2.5, 0)
          c.stroke()
          c.beginPath()
          c.ellipse(0, 0, s * 1.5, s * 1, 0, 0, Math.PI * 2)
          c.stroke()

          // Viewport
          c.beginPath()
          c.moveTo(s * 1.2, -s * 0.35)
          c.lineTo(s * 1.8, 0)
          c.lineTo(s * 1.2, s * 0.35)
          c.lineTo(s * 0.5, s * 0.25)
          c.lineTo(s * 0.5, -s * 0.25)
          c.closePath()
          c.fillStyle = `rgba(120,85,105,${alpha * 0.55})`
          c.fill()

          // Side nacelles
          for (const dir of [-1, 1]) {
            c.beginPath()
            c.moveTo(-s * 0.3, dir * s * 1.2)
            c.lineTo(-s * 0.3, dir * s * 2.2)
            c.lineTo(s * 0.3, dir * s * 2.2)
            c.lineTo(s * 0.3, dir * s * 1.2)
            c.closePath()
            c.fillStyle = `rgba(80,75,90,${alpha * 0.6})`
            c.fill()

            c.beginPath()
            c.ellipse(0, dir * s * 2.8, s * 1.5, s * 0.5, 0, 0, Math.PI * 2)
            const nacG = c.createLinearGradient(0, dir * (s * 2.3), 0, dir * (s * 3.3))
            nacG.addColorStop(0, `rgba(110,105,120,${alpha * 0.7})`)
            nacG.addColorStop(0.5, `rgba(75,70,85,${alpha * 0.65})`)
            nacG.addColorStop(1, `rgba(50,46,58,${alpha * 0.6})`)
            c.fillStyle = nacG
            c.fill()
            c.strokeStyle = `rgba(150,145,160,${alpha * 0.15})`
            c.lineWidth = 0.3
            c.stroke()

            // Running light
            c.beginPath()
            c.arc(s * 1.2, dir * s * 2.8, s * 0.12, 0, Math.PI * 2)
            c.fillStyle = `rgba(230,180,140,${alpha * 0.7})`
            c.fill()
          }

          // Engine exhausts from nacelles
          for (const dir of [-1, 1]) {
            const ny = dir * s * 2.8
            const flameLen = s * (1.4 + Math.random() * 0.4) * ef
            c.beginPath()
            c.moveTo(-s * 1.5, ny - s * 0.3)
            c.lineTo(-s * 1.5 - flameLen, ny)
            c.lineTo(-s * 1.5, ny + s * 0.3)
            c.closePath()
            const flameG = c.createLinearGradient(-s * 1.5, ny, -s * 1.5 - flameLen, ny)
            flameG.addColorStop(0, `rgba(240,220,200,${alpha * ef * 0.5})`)
            flameG.addColorStop(0.4, `rgba(200,160,130,${alpha * ef * 0.3})`)
            flameG.addColorStop(1, `rgba(160,100,80,0)`)
            c.fillStyle = flameG
            c.fill()
          }
        }

        c.restore()
      }

      // ─ Lasers ─
      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i]
        l.life++
        l.x += l.vx
        l.y += l.vy

        if (l.life >= l.maxLife) {
          if (Math.random() > 0.4) spawnExplosion(l.x, l.y)
          lasers.splice(i, 1)
          continue
        }

        const alpha = (1 - l.life / l.maxLife) * 0.7
        const tc = teamColors[l.team]
        const tailX = l.x - l.vx * 4
        const tailY = l.y - l.vy * 4

        // Laser glow
        ctx!.beginPath()
        ctx!.moveTo(tailX, tailY)
        ctx!.lineTo(l.x, l.y)
        ctx!.strokeStyle = `${tc.glow}${alpha * 0.3})`
        ctx!.lineWidth = 4
        ctx!.stroke()

        // Laser core
        const gradient = ctx!.createLinearGradient(tailX, tailY, l.x, l.y)
        gradient.addColorStop(0, `${tc.glow}0)`)
        gradient.addColorStop(0.3, `${tc.glow}${alpha})`)
        gradient.addColorStop(1, `rgba(255,255,255,${alpha})`)

        ctx!.beginPath()
        ctx!.moveTo(tailX, tailY)
        ctx!.lineTo(l.x, l.y)
        ctx!.strokeStyle = gradient
        ctx!.lineWidth = 1.5
        ctx!.stroke()
      }

      // ─ Explosions ─
      for (let i = explosions.length - 1; i >= 0; i--) {
        const e = explosions[i]
        e.radius += 0.5
        e.opacity -= 0.015

        if (e.opacity <= 0 || e.radius >= e.maxRadius) {
          explosions.splice(i, 1)
          continue
        }

        // Flash ring
        ctx!.beginPath()
        ctx!.arc(e.x, e.y, e.radius, 0, Math.PI * 2)
        ctx!.strokeStyle = `rgba(251, 191, 36, ${e.opacity * 0.5})`
        ctx!.lineWidth = 1.5
        ctx!.stroke()

        // Center glow
        const cg = ctx!.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.radius * 0.6)
        cg.addColorStop(0, `rgba(255, 220, 100, ${e.opacity * 0.4})`)
        cg.addColorStop(1, `rgba(251, 146, 60, 0)`)
        ctx!.beginPath()
        ctx!.arc(e.x, e.y, e.radius * 0.6, 0, Math.PI * 2)
        ctx!.fillStyle = cg
        ctx!.fill()

        // Debris particles
        for (const p of e.particles) {
          const px = e.x + p.dx * e.radius * 0.8
          const py = e.y + p.dy * e.radius * 0.8
          ctx!.beginPath()
          ctx!.arc(px, py, p.size * e.opacity, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(255, 200, 80, ${e.opacity * 0.7})`
          ctx!.fill()
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    // Spawn initial ship
    setTimeout(() => spawnShip(), 500)

    const handleResize = () => {
      w = canvas.clientWidth || window.innerWidth
      h = canvas.clientHeight || window.innerHeight
      const currentDpr = window.devicePixelRatio || 1
      canvas.width = w * currentDpr
      canvas.height = h * currentDpr
      ctx.setTransform(currentDpr, 0, 0, currentDpr, 0, 0)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
        background: "linear-gradient(180deg, #0B1120 0%, #0F172A 40%, #1a1032 100%)",
      }}
    />
  )
}
