/**
 * Created by Lucien on 21/11/2017.
 */

var Particules = function (params) {
    this.parentEl = params.parentEl;
    this.fps = params.fps || 70;
    this.colors = params.colors || [0x000000];
    this.numberOfParticules = params.numberOfParticules || 70;
    this.particuleSize = params.particuleSize || 1;
    this.ratio = params.ration || (window.innerWidth/window.innerHeight);
    this.width = this.parentEl.offsetWidth;
    this.height = this.parentEl.offsetHeight;
    this.particules = [];
    this.speed = 0.2;
};

Particules.prototype.init = function(){
    this.initScene();
    this.initRenderer();
    this.initCamera();
    this.build();

    this.parentEl.addEventListener("mousemove", this.onMouseMove.bind(this))
};

Particules.prototype.build = function () {
    this.buildRenderer();
    this.buildCamera();
    this.buildParticules();
};

Particules.prototype.initScene = function(){
    this.scene = new THREE.Scene();
};

Particules.prototype.initCamera = function(){
    this.camera = new THREE.PerspectiveCamera(this.fps, this.ratio, 0.1, 1000);
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 600;
};

Particules.prototype.buildCamera = function(){
    this.scene.add(this.camera);
};

Particules.prototype.initRenderer = function(){
    this.renderer = new THREE.WebGLRenderer( { alpha: true } );
    this.renderer.setSize(this.width, this.height);
};

Particules.prototype.buildRenderer = function(){
    this.parentEl.appendChild(this.renderer.domElement);
};

Particules.prototype.setPositionParticule = function(particule){
    particule.position.x = Math.random() * (this.width / 2 - (-this.width / 2)) + (-this.width / 2);
    particule.position.y = Math.random() * (this.width / 2 - (-this.width / 2)) + (-this.width / 2);
    particule.position.z = Math.random() * (50 - 10) + 10;
    this.scene.add(particule);
    var angle = Math.random() * (2 * Math.PI);
    particule.direction = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    };
};

Particules.prototype.buildParticules = function(){
    for(var i = 0; i < this.numberOfParticules; i++){
        var geometry = new THREE.CircleGeometry(Math.random() * (this.particuleSize - (this.particuleSize * 0.5)) + (this.particuleSize * 0.8), 200);
        var material = new THREE.MeshBasicMaterial({
            color: eval(this.colors[Math.floor(Math.random() * this.colors.length)]),
            opacity: 1
        });
        var particule = new THREE.Mesh(geometry, material);
        this.setPositionParticule(particule);
        this.particules.push(particule);
    }
};

Particules.prototype.anim = function(){
    requestAnimationFrame(this.anim.bind(this));
    this.renderer.render(this.scene, this.camera);
    for(var i = 0; i < this.particules.length; i++){
        this.particules[i].position.x += this.particules[i].direction.x * (Math.random() * (this.speed - 0.05) + 0.05);
        this.particules[i].position.y += this.particules[i].direction.y * (Math.random() * (this.speed - 0.05) + 0.05);
        if(this.particules[i].position.x >= this.width / 2 ||
            this.particules[i].position.y >= this.width / 2 ||
            this.particules[i].position.x <= -this.width / 2 ||
            this.particules[i].position.y <= -this.width / 2){
            this.setPositionParticule(this.particules[i]);
        }
    }
};

Particules.prototype.onMouseMove = function (e) {
    var distX = e.clientX - (this.width / 2);
    var distY = e.clientY - (this.height / 2);
    this.camera.position.x = distX * 0.005;
    this.camera.position.y = - distY * 0.005;
};