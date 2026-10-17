# nanwp.com redesign: implementation plan

Dark industrial look (obsidian `#070709`, matte slate `#111116`, cyan `#00F0FF` and emerald `#10B981` accents).
Built on the existing **SvelteKit 5 + Tailwind 4** app, with **Three.js** and **GSAP ScrollTrigger**. Staying on
SvelteKit kept the blog, markdown loader and `adapter-node` deploy unchanged. The scene is written in plain Three.js
with no framework bindings, so it could be moved to TresJS or R3F later.

## Architecture

```
routes/+page.svelte
 ├─ SceneCanvas        fixed, -z-10. Lazy-imports three + gsap, wires ScrollTrigger → scene.state
 │   └─ NetworkScene   lib/three/NetworkScene.ts: framework-free class, reads `state` each frame
 ├─ Hero               data-stage="hero"
 ├─ StackBento         data-stage="architecture" (core explodes into 4 layers)
 ├─ TelemetryHUD       data-stage="telemetry"   (nodes emit pulse rings)
 ├─ CaseStudies        data-stage="work"        (camera pans; hover focuses an anchor node)
 └─ experience/writing data-stage="outro"       (scene recedes for long-form reading)
+layout: Navbar (pill + ⌘K) · Footer (Jakarta clock + Terminal) · CommandPalette
```

**How the scroll drives the scene.** `STAGES` in `NetworkScene.ts` holds one camera and effect keyframe per section.
For each pair of consecutive `[data-stage]` sections, `SceneCanvas` creates a scrubbed `gsap.fromTo(scene.state, …)`.
The render loop only reads `state` and never touches the DOM. To change the choreography, edit `STAGES`.

**Spatial anchors.** `NetworkScene.ANCHORS` maps case-study index to node index. When a card is hovered or focused,
it calls `sceneRef.current?.setFocus(i)`.

## Performance budget (target 60fps)

| Technique                                                                                                                                    | Where                          |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| three and gsap load through dynamic `import()` after mount, so they stay out of the initial JS (~128 kB gz chunk loaded later)               | `SceneCanvas`                  |
| Single draw call each for all fibres (merged `LineSegments`), all packets and their trails (`Points` + additive shader), and all status LEDs | `NetworkScene`                 |
| Shared geometries and materials for nodes; no per-frame allocation in the hot loop except one scratch `Vector3`                              | `NetworkScene`                 |
| DPR capped at 1.75; drops to 1 automatically if the average frame time is over 22ms                                                          | `trackPerformance`             |
| Loop pauses on `visibilitychange`; ≤4-core devices get the `low` quality tier (fewer nodes and packets, no MSAA)                             | `NetworkScene` / `SceneCanvas` |
| Bento tilt writes CSS variables only, with no Svelte re-render on pointer move                                                               | `StackBento`                   |

## Fallback states

| Condition                           | Behaviour                                                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `< 768px`, `Save-Data`, or no WebGL | `TopologyFallback.svelte`: static SVG topology, CSS-animated packets, three/gsap never downloaded             |
| `prefers-reduced-motion`            | Scene renders only when scroll changes state (no idle animation); CSS packets, pings and reveals are disabled |
| Touch / coarse pointer              | No parallax, no bento tilt                                                                                    |

## Content rules

Every number in `lib/data/caseStudies.ts` (`impact`, `metrics`) comes from `experiences.json`. The hero readout and
the HUD stream are visibly labelled as simulated. Keep it that way: if you add a metric, it needs a real source.

## Next steps

1. **Content:** add real throughput or latency numbers to the payments case study if they can be shared.
2. **Projects stage:** give each case study its own camera keyframe (sub-stages inside `work`) for a true sideways pan per card.
3. **Postprocessing:** a subtle `UnrealBloomPass` on the packets, enabled only on the `high` tier.
4. **OG image:** a static render of the hero scene for social cards.
5. **Lighthouse pass:** check LCP (the hero `h1`) and CLS (fonts: consider self-hosting Inter and JetBrains Mono).
