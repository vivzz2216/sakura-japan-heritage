---
name: Sakura
description: A serene Japanese shrine sanctuary set across multi-plane parallax layers.
colors:
  daylight-ink: "#192436"
  daylight-secondary: "#2d3e56"
  daylight-sky: "#87b2dc"
  night-ink: "#f4f1f8"
  night-secondary: "#d7d4e6"
  night-sky: "#0d1b33"
  panel: "#faf6f4"
  panel-ink: "#1f2737"
  wordmark-day: "#fff0f5"
  wordmark-night: "#ead4e8"
typography:
  wordmark:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(118px, 23.5vw, 390px)"
    fontWeight: 600
    lineHeight: 0.78
    letterSpacing: "-0.035em"
  heading:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(32px, 3.6vw, 56px)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "clamp(13.5px, 1.02vw, 16px)"
    lineHeight: 1.58
---

# Design System: Sakura

## Overview

Sakura is a single-screen digital sanctuary that places a large serif `sakura` wordmark between a distant snow-capped mountain horizon and an alpha-matted traditional Japanese waterfront shrine framed by blooming cherry trees and a foreground moss-and-petal bank.

## Layered Depth & Motion

1. **Sky & Distant Mountains**: Moves inversely to pointer movement (`-10px` X, `-6px` Y) and crossfades between warm spring daylight and a starlit full-moon night sky.
2. **Wordmark (`sakura`)**: Rises letter-by-letter from behind the shrine roof and sakura branches, followed by a subtle ongoing vertical breathing motion.
3. **Shrine & Sakura Trees**: Transparent RGBA cutout overlapping the lower edge and sides of the wordmark. In night mode, shoji screens and stone lanterns glow with warm amber candlelight and reflect across the pond.
4. **Foreground Bank**: Close-up grass, wildflowers, stepping stones, and fallen sakura petals moving at `24px` X, `12px` Y parallax.
5. **Living Atmosphere**: Dual-depth HTML5 canvas sakura petals drift with varied size, 3D tumble, and breeze response; at night, soft fireflies carry diffuse radial light pools across the foreground.

