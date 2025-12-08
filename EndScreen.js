import * as THREE from 'three'

export class EndScreen {
    constructor(scene) {
        this.scene = scene
        const camera = scene.getObjectsByProperty('isCamera', true)[0]

        this.focus_point = camera.parent

        if (localStorage.getItem('lan')) {
            const language = localStorage.getItem('lan')
            //console.log("language is: ", language)
            if (language == 'Mandarin') {
                this.end_text = createTextSprite('你赢了！')
            }
            else if (language == 'Hebrew') {
                //console.log('im jewish bro')
                this.end_text = createTextSprite('אתה מנצח!')
            }
            else {
                this.end_text = createTextSprite('you won wow!')
            }
        }
        else {
            //console.log("no language to be found")
            this.end_text = createTextSprite('you won wow!')
        }
        
        this.end_text.position.set(0, 0, 0)
        this.end_text.scale.set(10, 10, 10)

        this.focus_point.add(this.end_text)
    }
    setFinalTextLanguage(language){
        //console.log("i hear you ", language)
        this.focus_point.remove(this.end_text)
        this.end_text = undefined
        if ((language == 'English') || (language == '英语') || (language == 'אַנגְלִית')) {
            this.end_text = createTextSprite('you won wow!')
        }
        else if ((language == 'Mandarin') || (language == '中国人') || (language == 'סִינִית')) {
            //console.log(' i am chinese')
            this.end_text = createTextSprite('你赢了！')
        }
        else if ((language == 'Hebrew') || (language ==  '希伯来语') || (language == 'עִברִית')) {
            this.end_text = createTextSprite('אתה מנצח!')
        }
        this.focus_point.add(this.end_text)
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

    //console.log(sprite)
    return sprite
}
