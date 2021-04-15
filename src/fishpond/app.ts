import * as PIXI from 'pixi.js'
import {DropShadowFilter} from '@pixi/filter-drop-shadow'

import {stage, loader, screen, ticker} from '~/core'
import Fish from './Fish'
import * as menu from './menu'

loader
  .add('static/texture/zero.json')
  .add('bkg.1.jpg', 'static/texture/bkg.1.jpg')
  .add('bkg.2.jpg', 'static/texture/bkg.2.jpg')
  .load(main)

const {PI, max, random, cos, sin} = Math
const PI2 = PI * 2
const PI_2 = PI / 2
const shadowFilter = new DropShadowFilter({distance: 12, quality: 1, rotation: 180})

function main() {
  const scene = new PIXI.Container()
  stage.addChild(scene)

  // 河床
  const bed = PIXI.Sprite.from('bkg.1.jpg')
  bed.rotation = PI_2
  bed.anchor.set(.5)
  bed.scale.set(max(screen.width / bed.height, screen.height / bed.width))
  bed.position.set(screen.width / 2, screen.height / 2)
  scene.addChild(bed)

  // 潭中鱼可百许头
  const fishes = Object.entries(Fish.Color).map(([k, v]) => {
    const fish = new Fish(v)
    fish.speed = (1 + random()) * 2
    fish.animationSpeed *= fish.speed
    fish.direction = random() * PI2
    fish.turnSpeed = random() - .8

    fish.position.set(random() * screen.width, random() * screen.height)

    return scene.addChild(fish)
  })

  // 荷叶
  {
    // 左上
    let lotus = PIXI.Sprite.from('zero.lotus.leaf.6.png')
    lotus.scale.set(.5)
    lotus.anchor.set(0)
    scene.addChild(lotus)

    // 右上
    lotus = PIXI.Sprite.from('zero.lotus.leaf.3.png')
    lotus.anchor.set(1, 0)
    lotus.x = screen.width
    scene.addChild(lotus)

    // 正下
    lotus = PIXI.Sprite.from('zero.lotus.leaf.7.png')
    lotus.anchor.set(.5, 1)
    lotus.y = screen.height
    lotus.x = screen.width / 2
    scene.addChild(lotus)
  }

  menu.show(scene)

  const bound = screen.clone().pad(100)

  ticker.add(() => {
    for (const fish of fishes) {
      fish.direction += fish.turnSpeed * .01
      fish.direction %= PI2
      fish.rotation = fish.direction
      fish.filters = [shadowFilter]

      fish.x -= cos(fish.rotation) * fish.speed
      fish.y -= sin(fish.rotation) * fish.speed

      fish.x < bound.left ? fish.x = bound.right :
      fish.x > bound.right ? fish.x = bound.left : 0

      fish.y < bound.top ? fish.y = bound.bottom :
      fish.y > bound.bottom ? fish.y = bound.top : 0
    }
  })
}