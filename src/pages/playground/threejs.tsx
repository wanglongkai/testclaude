// ============================================================
// Three.js 入门示例 — 一个带轨道控制的旋转立方体
// 适合初学者了解 Three.js 核心概念：场景、相机、渲染器、
// 几何体、材质、网格、光照、动画循环与资源清理
// ============================================================

import { useEffect, useRef } from 'react'
import { Card } from 'antd'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default function ThreeJsPlayground() {
  // mountRef 挂载到 DOM 上，Three.js 会把 canvas 放到这个容器里
  const mountRef = useRef<HTMLDivElement>(null)

  // useEffect 保证 DOM 渲染完成后才初始化 Three.js
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // 用容器的实际尺寸来适配渲染
    const width = mount.clientWidth
    const height = mount.clientHeight

    // ---- 1. 场景（Scene）：存放所有物体的 3D 空间 ----
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0f172a') // 深色背景

    // ---- 2. 相机（Camera）：定义"从哪个角度观察" ----
    // PerspectiveCamera(视野角度, 宽高比, 近裁剪面, 远裁剪面)
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.set(3, 3, 5) // 把相机放到 (x=3, y=3, z=5) 的位置

    // ---- 3. 渲染器（Renderer）：把场景+相机画到 canvas 上 ----
    const renderer = new THREE.WebGLRenderer({ antialias: true }) // antialias 抗锯齿
    renderer.setPixelRatio(window.devicePixelRatio) // 适配高清屏
    renderer.setSize(width, height) // 设置画布尺寸
    mount.appendChild(renderer.domElement) // 把 canvas 添加到页面

    // ---- 4. 光照（Light）：没有光就看不到物体 ----
    // 环境光 — 均匀照亮所有面，没有方向
    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)
    // 平行光 — 模拟太阳，有方向，产生明暗对比
    const directional = new THREE.DirectionalLight(0xffffff, 1)
    directional.position.set(5, 10, 7)
    scene.add(directional)

    // ---- 5. 物体（Mesh）= 几何体（形状）+ 材质（外观） ----
    // BoxGeometry(宽, 高, 深) — 创建一个立方体
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
    // MeshStandardMaterial — 受光照影响的材质
    const material = new THREE.MeshStandardMaterial({
      color: '#1677ff',
      roughness: 0.4,  // 粗糙度 0~1，越小越光滑
      metalness: 0.2,  // 金属感 0~1，越大越像金属
    })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    // ---- 6. 辅助工具：网格地面 ----
    // GridHelper(尺寸, 划分格数, 中心线颜色, 网格线颜色)
    const grid = new THREE.GridHelper(20, 20, 0x334155, 0x1e293b)
    grid.position.y = -1.2 // 下移，让立方体浮在网格上方
    scene.add(grid)

    // ---- 7. 轨道控制器（OrbitControls）：让用户拖拽旋转视角 ----
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true // 启用惯性效果，手感更顺滑

    // ---- 8. 动画循环（Animation Loop）— Three.js 的核心模式 ----
    // 每一帧更新物体状态，然后重新渲染
    let frameId = 0
    const animate = () => {
      // 让立方体绕 X 轴和 Y 轴缓慢旋转
      cube.rotation.x += 0.01
      cube.rotation.y += 0.012
      controls.update()       // 更新轨道控制器（惯性效果需要）
      renderer.render(scene, camera) // 渲染一帧
      frameId = requestAnimationFrame(animate) // 请求下一帧
    }
    animate()

    // ---- 9. 窗口自适应：浏览器大小变化时同步更新 ----
    const handleResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h             // 更新相机宽高比
      camera.updateProjectionMatrix()   // 让相机重新计算投影
      renderer.setSize(w, h)            // 更新渲染器尺寸
    }
    window.addEventListener('resize', handleResize)

    // ---- 10. 清理（Cleanup）：组件卸载时释放所有资源 ----
    // 防止内存泄漏，这是 React + Three.js 非常关键的一步
    return () => {
      cancelAnimationFrame(frameId)      // 停止动画循环
      window.removeEventListener('resize', handleResize) // 移除事件
      controls.dispose()                 // 释放控制器
      geometry.dispose()                 // 释放几何体 GPU 内存
      material.dispose()                 // 释放材质 GPU 内存
      renderer.dispose()                 // 释放渲染器 GPU 内存
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement) // 移除 canvas
      }
    }
  }, []) // 空数组：只在组件挂载时执行一次

  return (
    <Card title="Three.js 示例 · 旋转立方体" styles={{ body: { padding: 0 } }}>
      {/* ref 挂载点，Three.js 会把 canvas 渲染到这个 div 内部 */}
      <div
        ref={mountRef}
        style={{ width: '100%', height: 'calc(100vh - 200px)', minHeight: 480 }}
      />
    </Card>
  )
}
