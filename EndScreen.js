import * as THREE from 'three'

export class EndScreen {
    constructor(scene) {
        const camera = scene.getObjectsByProperty('isCamera', true)[0]

        this.focus_point = camera.parent

        this.end_text = createTextSprite('you won wow!')
        this.end_text.position.set(0, 0, 0)
        this.end_text.scale.set(10, 10, 10)

        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshPhongMaterial({ color: 0xf48072 })

        const center_cube = new THREE.Mesh(geometry, material)
        center_cube.position.set(0, 0, 0)

        this.focus_point.add(this.end_text)
        this.focus_point.add(center_cube)
    }
}
function createTextSprite(message) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = 'Bold 30px Arial'
    context.fillStyle = 'rgba(255, 255, 255, 1.0)' // Change the color of the game title
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(message, canvas.width / 2, canvas.height / 2) // Draw the text

    const texture = new THREE.CanvasTexture(canvas)
    // Setting needsUpdate to true ensures the texture is updated
    texture.needsUpdate = true

    const material = new THREE.SpriteMaterial({ map: texture })
    const sprite = new THREE.Sprite(material)
    sprite.center.set(0.5, 0.5)
    sprite.scale.set(10, 5, 5)

    console.log(sprite)
    return sprite
}
