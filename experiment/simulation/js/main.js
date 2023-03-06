// import * as THREE from 'three';
import { OrbitControls } from './orbit.js'
import * as THREE from './three.js'
import {
  AddLight,
  addSphere,
  addSphereAtCoordinate,
  CheckHover,
  DeleteObject,
  RepeatPattern,
  TranslatePattern,
  updateButtonCSS,
  highlightSelectList,
  moveSelectList,
  checkSCP,
  select_Region,
} from './utils.js'

// init container
var container = document.getElementById('canvas-main')

// init the renderer and the scene
var scene = new THREE.Scene()
var renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setClearColor('#000000')
renderer.setSize(container.clientWidth, container.clientHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
container.appendChild(renderer.domElement)

// init perspective camera
var camera_distance = 25
var perspective_camera = new THREE.PerspectiveCamera(
  camera_distance, //FOV
  container.clientWidth / container.clientHeight, //aspect ratio
  0.1,
  1000,
)
var orthographic_camera = new THREE.OrthographicCamera(
  camera_distance / -2,
  camera_distance / 2,
  camera_distance / 2,
  camera_distance / -2,
  1,
  1000,
)
var camera = perspective_camera

// init the orbit controls
var controls = new OrbitControls(camera, renderer.domElement)
controls.update()
controls.autoRotate = true
controls.autoRotateSpeed = 0
controls.enablePan = false
controls.enableDamping = true
camera.position.set(25, 25, 25)

// initialize the axes
var axesHelper = new THREE.AxesHelper(container.clientHeight)
scene.add(axesHelper)

// add light to the  system
const lights = AddLight()
for (let i = 0; i < lights.length; i++) {
  scene.add(lights[i])
}

let Checked = document.getElementById('ToggleCamera')
Checked.addEventListener('click', function () {
  console.log('Clicked camera toggle')
  if (Checked.checked) {
    camera = orthographic_camera
    controls = new OrbitControls(camera, renderer.domElement)
  } else {
    camera = perspective_camera
    controls = new OrbitControls(camera, renderer.domElement)
  }
  controls.update()
  controls.autoRotate = true
  controls.autoRotateSpeed = 0
  controls.enablePan = false
  controls.enableDamping = true
  camera.position.set(25, 25, 25)
})

// to check the current object which keyboard points to
let INTERSECTED

function getMouseCoords(event) {
  var mouse = new THREE.Vector2()
  mouse.x =
    ((event.clientX - renderer.domElement.offsetLeft) /
      renderer.domElement.clientWidth) *
      2 -
    1
  mouse.y =
    -(
      (event.clientY - renderer.domElement.offsetTop) /
      renderer.domElement.clientHeight
    ) *
      2 +
    1
  //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  //console.log(mouse);
  return mouse
}
var mouse = new THREE.Vector2()
//  detect mouse click
let drag = false
document.addEventListener('mousedown', function (event) {
  drag = false
  mouse = getMouseCoords(event)
})
document.addEventListener('mousemove', function (event) {
  drag = true
  mouse = getMouseCoords(event)
})

let action = ''

// create a list of atoms in scene
var atomList = []

var SelectAtomList = []
var BoundaryAtomList = []

var currentatom = document.getElementById('atomtype')
var atomtype = currentatom.options[currentatom.selectedIndex].text

var currentlattice = document.getElementById('latticetype')
var latticetype = currentlattice.options[currentlattice.selectedIndex].text

var CurrentHull
var CurrentHullMesh
var HullList = []

currentlattice.addEventListener('click', function () {
  // console.log('lattice change to', currentLattice)
  for (let i = 0; i < atomList.length; i++) {
    scene.remove(atomList[i])
  }
  for (let i = 0; i < HullList.length; i++) {
    scene.remove(HullList[i])
  }
})

// select region enclosed between the atoms
const selectRegion = document.getElementById('SelectRegion')

selectRegion.addEventListener('click', function () {
  if (SelectAtomList.length < 4) {
    alert(
      'Select Region Button expects atleast 4 non planar points to be selected',
    )
    return
  }
  for (let i = 0; i < HullList.length; i++) {
    scene.remove(HullList[i])
  }

  let vals = select_Region(SelectAtomList, atomList)
  let hullmesh = vals.mesh
  CurrentHullMesh = vals.mesh
  let arr = vals.selectarray
  CurrentHull = vals.convexHull
  for (let i = 0; i < arr.length; i++) {
    if (!SelectAtomList.includes(arr[i])) {
      SelectAtomList.push(arr[i])
    }
  }
  HullList.push(hullmesh)
  scene.add(hullmesh)
})

let toggleselectbutton = document.getElementById('ToggleSelect')
toggleselectbutton.addEventListener('click', function () {
  if (action != 'selectAtom') {
    action = 'selectAtom'
  } else {
    action = ''
    // SelectAtomList = []
  }
})
const ClearStuff = document.getElementById('ClearSelection')
ClearStuff.addEventListener('click', function () {
  SelectAtomList = []
  for (let i = 0; i < HullList.length; i++) {
    scene.remove(HullList[i])
  }
  HullList = []
  //add vector removal here
})

function templattice() {
  console.log('adding body centered cubic')
  let latticedims = [4, 4, 4]
  for (let x = -4; x < latticedims[0]; x += 4) {
    for (let y = -4; y < latticedims[1]; y += 4) {
      for (let z = -4; z < latticedims[2]; z += 4) {
        let pos = new THREE.Vector3(x, y, z)
        let atom = addSphereAtCoordinate(pos, 'Y')
        atomList.push(atom)
        scene.add(atom)
      }
    }
  }
}
// templattice()

const Slider = document.getElementById('radiiSlider')
const sliderval = document.getElementById('radiisliderval')
sliderval.innerHTML = Slider.valueAsNumber
var currentradii = Slider.valueAsNumber

Slider.oninput = function () {
  currentradii = Slider.valueAsNumber
  sliderval.innerHTML = Slider.valueAsNumber
  var newatomlist = []

  for (let i = 0; i < atomList.length; i++) {
    var pos = atomList[i].position
    let atom = addSphereAtCoordinate(pos, 'Y')
    scene.remove(atomList[i])
    scene.add(atom)
    newatomlist.push(atom)
  }
  atomList = newatomlist
  SelectAtomList = []
}

// respond to check for SCP

const addCheckSC = document.getElementById('CheckSC')
addCheckSC.addEventListener('click', function () {
  console.log('checking SCP packing')
  var checkresult = checkSCP(latticetype, CurrentHull)
  if (checkresult) {
    document.getElementById('latticeCheck').innerHTML =
      "<span style='color: Green; font-size: 20px;'>Correct</span>"
  } else {
    document.getElementById('latticeCheck').innerHTML =
      "<span style='color: red; font-size: 20px;'>Incorrect</span>"
  }
})

// respond to add atom by coordinate
const formAdd = document.getElementById('addatom')
formAdd.addEventListener('submit', function () {
  console.log('adding atom')
  var vec = formAdd.elements
  var AddVec = new THREE.Vector3(
    parseFloat(vec[0].value),
    parseFloat(vec[1].value),
    parseFloat(vec[2].value),
  )
  var addedatom = addSphereAtCoordinate(AddVec, 'Y')
  console.log(AddVec, addedatom)
  scene.add(addedatom)
  atomList.push(addedatom)
})

// respond to add dummy atom by coordinate
const formAdddummy = document.getElementById('adddummyatom')
formAdddummy.addEventListener('submit', function () {
  console.log('adding dummy atom')
  var vec = formAdddummy.elements
  var AddVec = new THREE.Vector3(
    parseFloat(vec[0].value),
    parseFloat(vec[1].value),
    parseFloat(vec[2].value),
  )
  var addedatom = addSphereAtCoordinate(AddVec, 'dummy')
  console.log(AddVec, addedatom)
  scene.add(addedatom)
  atomList.push(addedatom)
})

// // respond to repeat
// const formRepeat = document.getElementById('repeat')
// formRepeat.addEventListener('submit', function () {
//   console.log('repeating')
//   var vec = formRepeat.elements
//   var repeatVec = new THREE.Vector3(
//     parseFloat(vec[0].value),
//     parseFloat(vec[1].value),
//     parseFloat(vec[2].value),
//   )
//   var newAtoms = RepeatPattern(SelectAtomList, repeatVec)

//   console.log(repeatVec, newAtoms)
//   for (let i = 0; i < newAtoms.length; i++) {
//     scene.add(newAtoms[i])
//     atomList.push(newAtoms[i])
//   }
//   SelectAtomList = []
//   for (let i = 0; i < HullList.length; i++) {
//     scene.remove(HullList[i])
//   }
//   console.log(atomList)
// })

// respond to translate
const formTranslate = document.getElementById('translate')
formTranslate.addEventListener('submit', function () {
  console.log('translating')
  var vec = formTranslate.elements
  var translateVec = new THREE.Vector3(
    parseFloat(vec[0].value),
    parseFloat(vec[1].value),
    parseFloat(vec[2].value),
  )
  var count = parseFloat(vec[3].value)
  var newAtoms = TranslatePattern(SelectAtomList, translateVec, count)

  for (let i = 0; i < newAtoms.length; i++) {
    var pos = newAtoms[i].position
    var atom = addSphereAtCoordinate(pos, 'Y')
    scene.add(atom)
    atomList.push(atom)
  }
  SelectAtomList = []
  for (let i = 0; i < HullList.length; i++) {
    scene.remove(HullList[i])
  }
})

// respond to move
const formMove = document.getElementById('move')
formMove.addEventListener('submit', function () {
  console.log('moving')
  var vec = formMove.elements
  var moveVector = new THREE.Vector3(
    parseFloat(vec[0].value),
    parseFloat(vec[1].value),
    parseFloat(vec[2].value),
  )
  moveSelectList(SelectAtomList, moveVector)
  console.log(moveVector, SelectAtomList)
})
// const translateList = document.getElementById("TranslatePattern");
// translateList.addEventListener("click", function () {});

// make the window responsive
window.addEventListener('resize', () => {
  renderer.setSize(container.offsetWidth, container.offsetHeight)
  camera.aspect = container.offsetWidth / container.offsetHeight
  camera.updateProjectionMatrix()
})

document.addEventListener('mouseup', function (event) {
  if (drag == false) {
    // if the action is add atom
    if (action == 'addAtom') {
      var newSphere = addSphere(mouse, atomtype, camera, scene)
      scene.add(newSphere)
      atomList.push(newSphere)
    } else if (action == 'selectAtom') {
      INTERSECTED = CheckHover(mouse, camera, atomList, INTERSECTED)
      if (INTERSECTED) {
        if (SelectAtomList.includes(INTERSECTED)) {
          var indexofatom = SelectAtomList.indexOf(INTERSECTED)
          SelectAtomList.splice(indexofatom, 1)
        } else {
          SelectAtomList.push(INTERSECTED)
        }
      }
    } else if (action == 'selectAll') {
      SelectAtomList = []
      for (let i = 0; i < atomList.length; i++) {
        SelectAtomList.push(atomList[i])
      }
    }
  }
})
//delete atom
document.addEventListener('keydown', function (event) {
  var keyCode = event.key
  if (keyCode == 'd') {
    // DeleteObject(mouse, camera, scene, atomList, SelectAtomList, INTERSECTED)
    INTERSECTED = CheckHover(mouse, camera, atomList)
    if (INTERSECTED) {
      var index = atomList.indexOf(INTERSECTED)
      if (index > -1) {
        atomList.splice(index, 1)
      }
      var index = SelectAtomList.indexOf(INTERSECTED)
      if (index > -1) {
        SelectAtomList.splice(index, 1)
      }
      scene.remove(INTERSECTED)
    }
  }
})

// render the scene and animate
var render = function () {
  // console.log(action, atomList, SelectAtomList, BoundaryAtomList);
  //console.log(BoundaryAtomList);
  currentatom = document.getElementById('atomtype')
  atomtype = currentatom.options[currentatom.selectedIndex].text

  currentlattice = document.getElementById('latticetype')
  latticetype = currentlattice.options[currentlattice.selectedIndex].text

  highlightSelectList(SelectAtomList, atomList)
  //   updateButtonCSS(action)
  console.log(SelectAtomList.length)
  INTERSECTED = CheckHover(mouse, camera, atomList, INTERSECTED)
  requestAnimationFrame(render)
  controls.update()
  renderer.render(scene, camera)
}

render()
