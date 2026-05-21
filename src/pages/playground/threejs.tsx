import { useEffect, useRef } from 'react'
import { Card } from 'antd'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default function ThreeJsPlayground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const width = mount.clientWidth
    const height = mount.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0f172a')

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.set(3, 3, 5)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    mount.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)
    const directional = new THREE.DirectionalLight(0xffffff, 1)
    directional.position.set(5, 10, 7)
    scene.add(directional)

    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
    const material = new THREE.MeshStandardMaterial({ color: '#1677ff', roughness: 0.4, metalness: 0.2 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    const grid = new THREE.GridHelper(20, 20, 0x334155, 0x1e293b)
    grid.position.y = -1.2
    scene.add(grid)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    let frameId = 0
    const animate = () => {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.012
      controls.update()
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      controls.dispose()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <Card title="Three.js 示例 · 旋转立方体" styles={{ body: { padding: 0 } }}>
      <div ref={mountRef} style={{ width: '100%', height: 'calc(100vh - 200px)', minHeight: 480 }} />
    </Card>
  )
}
