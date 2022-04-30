const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 567;

c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.5

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background2.png'
})

// const shop = new Sprite({
//     position: {
//         x: 690,
//         y: 395
//     },
//     imageSrc: './img/TX Chest Animation.png',
//     scale: 1,
//     frameMax: 28

// })



const player = new Fighter({
    position: {
        x: 200,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/playerone/Idle.png',
    frameMax: 10,
    scale: 2.75,
    offset: {
        x: 215,
        y: 85
    },
    sprites: {
        idle: {
            imageSrc: './img/playerone/Idle.png',
            frameMax: 10
        },
        run: {
            imageSrc: './img/playerone/Run.png',
            frameMax: 8
        },
        jump: {
            imageSrc: './img/playerone/Jump.png',
            frameMax: 3
        },
        fall: {
            imageSrc: './img/playerone/Fall.png',
            frameMax: 3
        },
        attack1: {
            imageSrc: './img/playerone/Attack2.png',
            frameMax: 7
        },
        takeHit: {
            imageSrc: './img/playerone/Take hit.png',
            frameMax: 3
        },
        death: {
            imageSrc: './img/playerone/Death.png',
            frameMax: 7
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 140,
        height: 50
    }


})


const enemy = new Fighter({
    position: {
        x: 800,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    frameMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 130
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            frameMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            frameMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            frameMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            frameMax: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack2.png',
            frameMax: 4
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            frameMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            frameMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -150,
            y: 50
        },
        width: 140,
        height: 50

    }
})



const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}


decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    // shop.update()
    player.update()
    enemy.update()
    player.velocity.x = 0
    enemy.velocity.x = 0
    // player movement

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    // jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')

    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    //enemy jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')

    }

    // detect

    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    })
        && player.isAttacking && player.frameCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }
    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false

    }
    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    })
        && enemy.isAttacking && enemy.frameCurrent === 2) {
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }
    if (enemy.isAttacking && enemy.frameCurrent === 2) {
        enemy.isAttacking = false
    }

    // end game based on health

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}
animate()

window.addEventListener('keydown', (e) => {
    if (!player.dead) {

        switch (e.key) {
            case "d":
                keys.d.pressed = true
                player.lastKey = 'd'
                break;
            case "a":
                keys.a.pressed = true
                player.lastKey = 'a'
                break;
            case "w":
                player.velocity.y = -15
                break;
            case ' ':
                player.attack()
                break;
        }
    }
    if (!enemy.dead) {
        switch (event.key) {
            case "ArrowRight":
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break;
            case "ArrowLeft":
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break;
            case "ArrowUp":
                enemy.velocity.y = -15
                break;
            case "ArrowDown":
                enemy.attack()
                break;
        }
    }

})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case "d":
            keys.d.pressed = false
            break;
        case "a":
            keys.a.pressed = false
            break;
        case "w":
            keys.w.pressed = false
            break;
    }
    // enemy keys
    switch (e.key) {
        case "ArrowRight":
            keys.ArrowRight.pressed = false
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false
            break;
        case "ArrowUp":
            keys.ArrowUp.pressed = false
            break;
    }
})