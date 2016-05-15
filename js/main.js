var World = require('three-world'),
    THREE = require('three'),
    Tunnel = require('./tunnel'),
    Player = require('./player'),
    Asteroid = require('./asteroid'),
    Shot = require('./shot')

var NUM_ASTEROIDS = 10
var updateVelocity = 0

var gameover = document.getElementById("gameover")
var audioShot = document.getElementById("shot")
var hit = document.getElementById("hit")
var damage = document.getElementById("damage")
var bg = document.getElementById("bg")
bg.loop = true
bg.play()


function render() {
  cam.position.z -= 1
  tunnel.update(cam.position.z)
  player.update()
  for(var i=0; i<shots.length; i++) {
    if(!shots[i].update(cam.position.z)) {
      World.getScene().remove(shots[i].getMesh())
      shots.splice(i, 1)
    }
  }

  for(var i=0; i<NUM_ASTEROIDS; i++) {
    if(updateVelocity < .005)
      updateVelocity += .00001
    if(!asteroids[i].loaded) continue
    asteroids[i].update(cam.position.z)
    asteroids[i].getMesh().velocity += updateVelocity
    if(player.loaded && player.bbox.isIntersectionBox(asteroids[i].bbox)) {
      asteroids[i].reset(cam.position.z)

      damage.play();
      health -= 10
      document.getElementById("health").textContent = health
      if(health < 1) {

        document.getElementById("gameovertext").textContent = "Game Over"
        gameover.play()


        for(i=0;i<1000000000; i++){

          World.pause()

        }


        window.location.reload()
      }
    }

    for(var j=0; j<shots.length; j++) {
      if(asteroids[i].bbox.isIntersectionBox(shots[j].bbox)) {
        score += 10
        //console.log(score)
        //if(score % 50 == 0) {
        //  console.log("here");
        //  health = 100
        //}

        hit.play();
        document.getElementById("score").textContent = score
        asteroids[i].reset(cam.position.z)
        World.getScene().remove(shots[j].getMesh())
        shots.splice(j, 1)
        break
      }
    }
  }
}

var health = 100, score = 0

World.init({ renderCallback: render, clearColor: 0x000022})
var cam = World.getCamera()

var tunnel = new Tunnel()
World.add(tunnel.getMesh())

var player = new Player(cam)
World.add(cam)

var asteroids = [], shots = []

for(var i=0;i<NUM_ASTEROIDS; i++) {
  asteroids.push(new Asteroid(Math.floor(Math.random() * 5) + 1))
  World.add(asteroids[i].getMesh())
}

World.getScene().fog = new THREE.FogExp2(0x0000022, 0.00125)

World.start()




window.addEventListener('keyup', function(e) {
 switch(e.keyCode) {
    case 32:                  // Space
      var shipPosition = cam.position.clone()
      shipPosition.sub(new THREE.Vector3(0, 25, 100))

      audioShot.play();
      var shot = new Shot(shipPosition)
      shots.push(shot)
      World.add(shot.getMesh())
    break
  }
})

window.addEventListener('keydown', function(e) {
 /* if(e.keyCode == 32){
     audioShot.play();
  }*/


  if(e.keyCode == 37) { //left
    if(cam.position.x>=-74){
      cam.position.x -= 4
    }
  }else if(e.keyCode == 39 ) { //right
    if(cam.position.x<=74){
      cam.position.x += 4
    }
  }

  if(e.keyCode == 38) {
    if(cam.position.y <= 90){ //up
      cam.position.y += 4
    }
  } else if(e.keyCode == 40) { //down
    if(cam.position.y >= -68){
      cam.position.y -= 4
    }
  }


})
