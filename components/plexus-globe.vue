<template>
  <div
    ref="containerRef"
    id="globe-container"
    class="globe-background"
    :style="{
      transformOrigin: 'center center',
      transition: 'transform 0.1s ease-out',
      transform: `scale(${scale}) translateX(${positionX}px) translateY(${positionY}px)`,
      backgroundColor: 'transparent'
    }"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  scale: { type: Number, default: 1.5 },
  positionX: { type: Number, default: 190 },
  positionY: { type: Number, default: 30 },
  rotationSpeed: { type: Number, default: 1 }, // Зафиксированное значение
  flickerIntensity: { type: Number, default: 0.33 }, // Зафиксированное значение
  gradientIntensity: { type: Number, default: 1.0 },
  connectionSwitching: { type: Number, default: 0.01 }, // Зафиксированное значение
  connectionQuantity: { type: Number, default: 0.01 }, // Зафиксированное значение
  whiteIntensity: { type: Number, default: 0.1 },
  cyanIntensity: { type: Number, default: 0.63 },
  blueIntensity: { type: Number, default: 0.3 },
  purpleIntensity: { type: Number, default: 0.56 },
  purpleHue: { type: Number, default: 254 }, // Зафиксированное значение
  blueHue: { type: Number, default: 271 }, // Зафиксированное значение
  cyanHue: { type: Number, default: 276 }, // Зафиксированное значение
})

const containerRef = ref(null)
const canvasRef = ref(null)

let resizeHandler = null

// Ensure transparent background
onMounted(() => {
  if (containerRef.value) {
    containerRef.value.style.backgroundColor = 'transparent'
    containerRef.value.style.zIndex = '1' // Убедимся, что глобус находится над фоном
    // Position globe to bottom right
    updateGlobePosition()
  }

  const loadThreeJS = async () => {
    if (!window.THREE) {
      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
      script.async = true
      script.onload = () => {
        initGlobe()
      }
      document.head.appendChild(script)
    } else {
      initGlobe()
    }
  }

  const initGlobe = () => {
    if (canvasRef.value) return

    class Canvas {
      constructor(selector) {
        this.selector = selector
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.frameEvent = new Event("frame")
        this.globeRadius = 80
        this.particlesCount = 400
        this.particlesDistance = 20
        this.particles = []
        this.lines = []
        
        // Settings from props
        this.rotationSpeedMultiplier = props.rotationSpeed
        this.flickerIntensity = props.flickerIntensity
        this.gradientIntensity = props.gradientIntensity
        this.connectionSwitching = props.connectionSwitching
        this.connectionQuantity = props.connectionQuantity
        this.whiteIntensity = props.whiteIntensity
        this.cyanIntensity = props.cyanIntensity
        this.blueIntensity = props.blueIntensity
        this.purpleIntensity = props.purpleIntensity
        this.purpleHue = props.purpleHue
        this.blueHue = props.blueHue
        this.cyanHue = props.cyanHue
      }

      setScene() {
        this.scene = new window.THREE.Scene()
        this.scenary = new window.THREE.Object3D()
        this.scene.add(this.scenary)
      }

      setCamera() {
        this.camera = new window.THREE.PerspectiveCamera(50, this.width / this.height, 1, 1000)
        this.camera.position.y = 0
        this.camera.position.z = 300
      }

      setRenderer() {
        this.renderer = new window.THREE.WebGLRenderer({
          antialias: true,
          alpha: true, // Transparent background
        })
        this.renderer.setSize(this.width, this.height)
        this.renderer.setClearColor(0x000000, 0) // Fully transparent
        const container = document.querySelector(this.selector)
        if (container) {
          container.innerHTML = ""
          container.appendChild(this.renderer.domElement)
          this.canvas = this.renderer.domElement
        }
      }

      addLights() {
        this.ambientLight = new window.THREE.AmbientLight(0xaaaaaa)
        this.directionalLight = new window.THREE.DirectionalLight(0xffffff)
        this.directionalLight.position.set(10, 0, 10).normalize()

        this.scenary.add(this.ambientLight)
        this.scenary.add(this.directionalLight)
      }

      addGlobe() {
        this.globeGeometry = new window.THREE.SphereGeometry(this.globeRadius, 40, 40)
        this.globeMaterial = new window.THREE.MeshPhongMaterial({
          color: 0x222222,
          wireframe: true,
          visible: false,
        })
        this.globe = new window.THREE.Mesh(this.globeGeometry, this.globeMaterial)
        this.scenary.add(this.globe)
      }

      addParticles() {
        this.particles = []
        this.lines = []

        for (let i = 0; i < this.particlesCount; i++) {
          const particle = this.createParticle(
            this.getRandomPosition("lat"),
            this.getRandomPosition("lon"),
            this.globeRadius,
          )

          this.particles.push(particle)
          this.globe.add(particle)

          this.particles.forEach((p) => {
            if (particle !== p) {
              if (particle.position.distanceTo(p.position) < this.particlesDistance) {
                const line = this.createLine(particle.position, p.position)
                this.lines.push(line)
                this.globe.add(line)
              }
            }
          })
        }
      }

      createParticle(lat, lon, globeRadius) {
        const geometry = new window.THREE.SphereGeometry(0.5, 10, 10)
        const material = new window.THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
        })
        const particle = new window.THREE.Mesh(geometry, material)
        const position = this.latLonToVector3(lat, lon, globeRadius)

        particle.position.set(position.x, position.y, position.z)
        particle.velocity = Math.random()
        particle.flickerPhase = Math.random() * Math.PI * 2

        return particle
      }

      createLine(positionStart, positionEnd) {
        const geometry = new window.THREE.BufferGeometry()
        const positions = new Float32Array([
          positionStart.x,
          positionStart.y,
          positionStart.z,
          positionEnd.x,
          positionEnd.y,
          positionEnd.z,
        ])
        geometry.setAttribute("position", new window.THREE.BufferAttribute(positions, 3))

        const colorGroup = Math.floor(Math.random() * 3)
        let startColor, endColor

        if (colorGroup === 0) {
          startColor = [1, 0, 1]
          endColor = [1, 0, 1, 0]
        } else if (colorGroup === 1) {
          startColor = [0, 0.5, 1]
          endColor = [0, 0.5, 1, 0]
        } else {
          startColor = [0, 1, 1]
          endColor = [0, 1, 1, 0]
        }

        const colors = new Float32Array([
          startColor[0],
          startColor[1],
          startColor[2],
          endColor[0],
          endColor[1],
          endColor[2],
        ])
        geometry.setAttribute("color", new window.THREE.BufferAttribute(colors, 3))

        const material = new window.THREE.LineBasicMaterial({
          vertexColors: true,
          linewidth: 0.1,
          fog: false,
          transparent: true,
        })
        material.userData.colorGroup = colorGroup
        material.userData.switchingPhase = Math.random() * Math.PI * 2
        material.userData.isVisible = true

        return new window.THREE.Line(geometry, material)
      }

      getRandomPosition(type) {
        let max = 180
        if (type === "lat") {
          max = 75
        }
        return Math.random() * (max * 2) - max
      }

      latLonToVector3(lat, lon, radius, heigth = 0) {
        const phi = (lat * Math.PI) / 180
        const theta = ((lon - 180) * Math.PI) / 180
        const x = -((radius + heigth) * Math.cos(phi) * Math.cos(theta))
        const y = (radius + heigth) * Math.sin(phi)
        const z = (radius + heigth) * Math.cos(phi) * Math.sin(theta)
        return new window.THREE.Vector3(x, y, z)
      }

      animate() {
        const canvas = this.canvas
        canvas.addEventListener("frame", () => {
          const now = Date.now()
          // Увеличенная скорость вращения для более заметного эффекта
          this.globe.rotation.y += 0.003 * this.rotationSpeedMultiplier

          this.particles.forEach((particle) => {
            const flicker = Math.sin(now * 0.005 + particle.flickerPhase) * 0.5 + 0.5
            const opacity = 0.2 + flicker * Math.max(0.8, this.flickerIntensity) * 0.8
            particle.material.opacity = opacity
          })

          // Создаем более "живое" переключение соединений
          this.lines.forEach((line, index) => {
            // Используем шум Перлина для более плавного и естественного переключения
            const noise = Math.sin(now * 0.001 + index * 0.1) * 0.5 + 0.5;
            const switchingFactor = this.connectionSwitching * 10; // Увеличиваем чувствительность
            
            // Определяем видимость на основе шума и параметров переключения
            const isVisible = noise > (0.9 - switchingFactor);
            
            if (isVisible) {
              // Плавное появление
              const fadeFactor = Math.min(1, (noise - (0.9 - switchingFactor)) / switchingFactor);
              line.material.opacity = 0.1 + fadeFactor * 0.9;
            } else {
              // Плавное исчезновение
              line.material.opacity = 0.1;
            }

            const colorGroup = line.material.userData.colorGroup
            let hue = 0
            let intensity = 1

            if (colorGroup === 0) {
              hue = this.purpleHue
              intensity = this.purpleIntensity
            } else if (colorGroup === 1) {
              hue = this.blueHue
              intensity = this.blueIntensity
            } else {
              hue = this.cyanHue
              intensity = this.cyanIntensity
            }

            const hslToRgb = (h, s, l) => {
              const hNorm = h / 360
              const c = (1 - Math.abs(2 * l - 1)) * s
              const x = c * (1 - Math.abs(((hNorm * 6) % 2) - 1))
              const m = l - c / 2
              let r = 0,
                g = 0,
                b = 0
              if (hNorm < 1 / 6) {
                r = c
                g = x
              } else if (hNorm < 2 / 6) {
                r = x
                g = c
              } else if (hNorm < 3 / 6) {
                g = c
                b = x
              } else if (hNorm < 4 / 6) {
                g = x
                b = c
              } else if (hNorm < 5 / 6) {
                r = x
                b = c
              } else {
                r = c
                b = x
              }
              return {
                r: (r + m) * intensity,
                g: (g + m) * intensity,
                b: (b + m) * intensity,
              }
            }

            const startColor = hslToRgb(hue, 1, 0.5)
            const endColor = hslToRgb(hue, 1, 0.5)
            endColor.r *= 0.3
            endColor.g *= 0.3
            endColor.b *= 0.3

            const colorAttribute = line.geometry.attributes.color
            colorAttribute.array[0] = startColor.r
            colorAttribute.array[1] = startColor.g
            colorAttribute.array[2] = startColor.b
            colorAttribute.array[3] = endColor.r
            colorAttribute.array[4] = endColor.g
            colorAttribute.array[5] = endColor.b
            colorAttribute.needsUpdate = true
          })
        })
      }

      render() {
        this.renderer.render(this.scene, this.camera)
        this.canvas.dispatchEvent(this.frameEvent)
        window.requestAnimationFrame(this.render.bind(this))
      }

      init() {
        this.setScene()
        this.setCamera()
        this.setRenderer()
        this.addLights()
        this.render()
        this.addGlobe()
        this.addParticles()
        this.animate()
      }
      
      updateSettings(newProps) {
        this.rotationSpeedMultiplier = newProps.rotationSpeed
        this.flickerIntensity = newProps.flickerIntensity
        this.gradientIntensity = newProps.gradientIntensity
        this.connectionSwitching = newProps.connectionSwitching
        this.connectionQuantity = newProps.connectionQuantity
        this.whiteIntensity = newProps.whiteIntensity
        this.cyanIntensity = newProps.cyanIntensity
        this.blueIntensity = newProps.blueIntensity
        this.purpleIntensity = newProps.purpleIntensity
        this.purpleHue = newProps.purpleHue
        this.blueHue = newProps.blueHue
        this.cyanHue = newProps.cyanHue
      }
    }

    const canvas = new Canvas("#globe-container")
    canvas.init()
    canvasRef.value = canvas
  }

  loadThreeJS()

  resizeHandler = () => {
    if (canvasRef.value && containerRef.value) {
      canvasRef.value.width = window.innerWidth
      canvasRef.value.height = window.innerHeight
    }
    // Update globe position on resize
    updateGlobePosition()
  }

  window.addEventListener("resize", resizeHandler)
})

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler)
  }
})

// Watch for prop changes
watch(() => props, (newProps) => {
  if (canvasRef.value) {
    canvasRef.value.updateSettings(newProps)
  }
}, { deep: true })

// Function to update globe position based on screen size
const updateGlobePosition = () => {
  if (containerRef.value) {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // On mobile, show only left half of the globe positioned on the right side
      containerRef.value.style.width = '50vw';
      containerRef.value.style.height = '100vh';
      containerRef.value.style.top = '0';
      containerRef.value.style.left = 'auto';
      containerRef.value.style.right = '0';
      containerRef.value.style.bottom = '0';
      containerRef.value.style.zIndex = '0';
      containerRef.value.style.position = 'fixed';
      containerRef.value.style.overflow = 'hidden';
    } else {
      // On desktop, position as background
      containerRef.value.style.width = '100%';
      containerRef.value.style.height = '100%';
      containerRef.value.style.top = '0';
      containerRef.value.style.left = '0';
      containerRef.value.style.right = 'auto';
      containerRef.value.style.bottom = 'auto';
      containerRef.value.style.zIndex = '0';
      containerRef.value.style.position = 'fixed';
    }
  }
}

</script>

<style scoped>
.globe-background {
  background-color: transparent;
  z-index: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Allow interactions with elements above */
}

/* Mobile positioning - left half on right side */
@media (max-width: 768px) {
  .globe-background {
    width: 50vw;
    height: 100vh;
    top: 0;
    left: auto;
    right: 0;
    bottom: 0;
    z-index: 0;
    position: fixed;
    overflow: hidden;
  }
}
</style>