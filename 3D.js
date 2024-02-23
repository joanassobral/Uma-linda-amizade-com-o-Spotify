// set up renderer and canvas
const renderer = new THREE.WebGL1Renderer({alpha:true})
renderer.setSize(window.innerWidth,window.innerHeight)

document.getElementById("canvas").appendChild(renderer.domElement);

let text_p = document.getElementById("text_p");
let forward_arrow = document.getElementById("forward_arrow");
let back_arrow = document.getElementById("back_arrow");
let counter = document.getElementById("counter");
let text_box = document.getElementById("text_box");
let arrow_box = document.getElementById("arrow_box");




// Set up structural elements: scene, camera, and orbit
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.001,10000)
camera.position.set(-7,0,15)

const orbit = new THREE.OrbitControls(camera,renderer.domElement)
orbit.update()



// Create lights
const ambientLight = new THREE.AmbientLight("white");

const spotLight = new THREE.SpotLight("white",10)
    spotLight.power = 50
    spotLight.angle = 4
    spotLight.distance = 40
    spotLight.position.set(20,20,20)

const spotLight2 = new THREE.SpotLight("white",10)
    spotLight2.power = 50
    spotLight2.angle = 4
    spotLight2.distance = 40
    spotLight2.position.set(-20,-20,-20)

scene.add(ambientLight,spotLight,spotLight2)



//Text
var interval;

function getNewText(newtext){
    text_p.innerText = "";
    if(interval){ clearInterval(interval) };
    textTransition(text_p,newtext,10);
}

function textTransition(element,string,speed){
    var i=0;
    interval = setInterval(() => {
        element.innerHTML += string.charAt(i);
        i++;
        if(i>string.length){
            clearInterval(interval);
        }
    }, speed);
}


//Creating, rendering, and changing models and text with arrows

const gltfLoader = new THREE.GLTFLoader();
var mesh;

function createModel(model_path){
    gltfLoader.load(model_path, function(gltf){
        mesh = gltf.scene

        if(model_path === '0/scene.gltf'){
            mesh.scale.set(0.2,0.2,0.2);
            back_arrow.style.opacity = "0"
        }

        if(model_path === '1/scene.gltf'){
            mesh.scale.set(0.4,0.4,0.4);
            mesh.rotation.y = 60;
            back_arrow.style.opacity = "1"
        }

        if(model_path === '2/scene.gltf'){
            mesh.scale.set(0.7,0.7,0.7);
            scene.remove(spotLight2)
            spotLight.power = 20
        }

        if(model_path === '3/scene.gltf'){
            mesh.scale.set(1,1,1);
            mesh.position.y = -4
            mesh.rotation.y = -90
        }

        if(model_path === '4/scene.gltf'){
            mesh.scale.set(5,5,5);
        }

        scene.add(mesh)

    })
}


let index = 0; 
let model_path; let text_id;

function next(){
    if(index == 4){
        document.location.replace(endPageFile);
    }

    index ++;
    counter.innerText = index+1 + "/5"
    changeModel(index)
}

function back(){
    if(index == 0){
        document.location.replace("index.html");
    }

    index --;
    counter.innerText = index+1 + "/5"
    changeModel(index)
}

function changeModel(){
    model_path = index + "/scene.gltf";
    createModel(model_path);

    text_id = eval("text"+index);
    getNewText(text_id);
}   



createModel('0/scene.gltf')

forward_arrow.addEventListener("click",()=>{
    scene.remove(mesh)
    next()
})
back_arrow.addEventListener("click",()=>{
    scene.remove(mesh)
    back()
})



// Animate renderer
function animate(){
    if(mesh){
        mesh.rotation.y += 0.003;
    }
    renderer.render(scene,camera)
}

renderer.setAnimationLoop(animate)
textTransition(text_p,text0,2)


// Resize renderer when window is resized
window.addEventListener("resize",()=>{
    camera.aspect*window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth/window.innerHeight)
    location.reload();
})