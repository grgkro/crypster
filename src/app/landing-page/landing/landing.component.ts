import gsap from 'gsap';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private zone: NgZone,
    private router: Router) { }

  ngOnInit(): void {

    const gui = new dat.GUI();

    const world = {
      plane: {
        width: 400,
        height: 400,
        widthSegments: 50,
        heightSegments: 50
      }
    }

    function generatePlane() {
      plane.geometry.dispose();
      plane.geometry = new THREE.PlaneGeometry(
        world.plane.width,
        world.plane.height,
        world.plane.widthSegments,
        world.plane.heightSegments
      );

      // vertices position randomization
      const { array } = plane.geometry.attributes.position;
      const randomValues = [];
      for (let i = 0; i < array.length; i++) {
        if (i % 3 === 0) {
          const x = array[i];
          const y = array[i + 1];
          const z = array[i + 2];

          array[i] = x + (Math.random() - 0.5) * 3;
          array[i + 1] = y + (Math.random() - 0.5) * 3;
          array[i + 2] = z + (Math.random() - 0.5) * 8;
        }

        randomValues.push(Math.random() * Math.PI * 2);
      }

      plane.geometry.attributes.position.randomValues =
        randomValues;

      plane.geometry.attributes.position.originalPosition =
        plane.geometry.attributes.position.array;

      // console.log(plane.geometry.attributes.position)

      // color attribute addition
      const colors = [];
      for (let i = 0;
        i < plane.geometry.attributes.position.count;
        i++) {
        colors.push(0, 0.19, 0.4);
      }
      // console.log(colors)

      plane.geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(new Float32Array(colors), 3)
      );

      // console.log(plane.geometry.attributes);
    }

    gui.add(world.plane, 'width', 1, 1000)
      .onChange(generatePlane);

    gui.add(world.plane, 'height', 1, 1000)
      .onChange(generatePlane);

    gui.add(world.plane, 'widthSegments', 1, 100)
      .onChange(generatePlane);

    gui.add(world.plane, 'heightSegments', 1, 100)
      .onChange(generatePlane);

    const raycaster = new THREE.Raycaster();
    // console.log(raycaster);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      innerWidth / innerHeight,
      0.1,
      1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(devicePixelRatio);

    const mouse = {
      x: undefined,
      y: undefined
    }

    function mouseMove(event) {
      event.preventDefault();
      mouse.x = (event.clientX / innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / innerHeight) * 2 + 1;
    }

    this.zone.runOutsideAngular(() => {
      document.addEventListener('mousemove', mouseMove.bind(this));
      document.body.appendChild(renderer.
        domElement);
    });

    const planeGeometry = new THREE.PlaneGeometry(
      world.plane.width,
      world.plane.height,
      world.plane.widthSegments,
      world.plane.heightSegments
    );
    const planeMaterial = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      flatShading: THREE.FlatShading,
      vertexColors: true
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    generatePlane();
    scene.add(plane);

    new OrbitControls(camera, renderer.domElement);
    camera.position.z = 60;

    const light = new THREE.DirectionalLight(
      0xFFFFFF, 1
    );
    light.position.set(0, 1, 1); //x=left/right, y=up/down, z=forward/backward
    scene.add(light);

    const backLlight = new THREE.DirectionalLight(
      0xFFFFFF, 1
    );
    backLlight.position.set(0, 0, -1); //x=left/right, y=up/down, z=forward/backward
    scene.add(backLlight);

    const starGeometry = new THREE.BufferGeometry();
    // const starGeometry = new THREE.SphereGeometry(150,32,16);
    const starMaterial = new THREE.
      PointsMaterial({
        color: 0xffffff
      });

    const starVertices = [];
    for (let i = 0; i < 10_000; i++) {
      let x = (Math.random() - 0.5) * 2000;
      if (x > 250 && x < 250) {
        x += (Math.random() - 0.5) * 700;
      }
      let y = (Math.random() - 0.5) * 2000;
      if (y > 250 && y < 250) {
        y += (Math.random() - 0.5) * 700;
      }
      let z = (Math.random() - 0.5) * 2000;
      if (z > 250 && z < 250) {
        z += (Math.random() - 0.5) * 700;
      }
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position',
      new THREE.Float32BufferAttribute(starVertices, 3));

    const stars = new THREE.Points(starGeometry,
      starMaterial);
    scene.add(stars);

    let frame = 0;
    let movementSpeed = 0.005;
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      frame += 0.01;
      // plane.rotation.x += 0.01;
      // plane.rotation.z += 0.01;

      const { array, originalPosition, randomValues } = plane.geometry.attributes.position;
      for (let i = 0; i < array.length; i += 3) {
        // make the vertice oszillate in x position
        array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * movementSpeed;
        // make the vertice oszillate in y = (x +1) position
        array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * movementSpeed;
      }

      plane.geometry.attributes.position.needsUpdate = true;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(plane);
      if (intersects.length > 0) {
        // console.log(intersects[0].face);

        const { color } = intersects[0].object.geometry.attributes;
        // vertice 1 (down left of the cursor)
        color.setX(intersects[0].face.a, 0.1);
        color.setY(intersects[0].face.a, 0.5);
        color.setZ(intersects[0].face.a, 1);
        // vertice 2 (down right of the cursor)
        color.setX(intersects[0].face.b, 0.1);
        color.setY(intersects[0].face.b, 0.5);
        color.setZ(intersects[0].face.b, 1);
        // vertice 3 (up of the cursor)
        color.setX(intersects[0].face.c, 0.1);
        color.setY(intersects[0].face.c, 0.5);
        color.setZ(intersects[0].face.c, 1);

        color.needsUpdate = true;

        const initialColor = {
          r: 0,
          g: 0.19,
          b: 0.4
        }

        const hoverColor = {
          r: 0.1,
          g: 0.5,
          b: 1
        }

        gsap.to(hoverColor, {
          r: initialColor.r,
          g: initialColor.g,
          b: initialColor.b,
          onUpdate: () => {
            // vertice 1 (down left of the cursor)
            color.setX(intersects[0].face.a, hoverColor.r);
            color.setY(intersects[0].face.a, hoverColor.g);
            color.setZ(intersects[0].face.a, hoverColor.b);
            // vertice 2 (down right of the cursor)
            color.setX(intersects[0].face.b, hoverColor.r);
            color.setY(intersects[0].face.b, hoverColor.g);
            color.setZ(intersects[0].face.b, hoverColor.b);
            // vertice 3 (up of the cursor)
            color.setX(intersects[0].face.c, hoverColor.r);
            color.setY(intersects[0].face.c, hoverColor.g);
            color.setZ(intersects[0].face.c, hoverColor.b);
          }
        })
      }

      // rotate stars
      stars.rotation.x += 0.0005;

    }

    animate();

    gsap.to('#heading1', {
      opacity: 1,
      y: 0,
      ease: 'expo',
      duration: 1.5
    });

    gsap.to('#main-text', {
      opacity: 1,
      y: 0,
      ease: 'expo',
      duration: 1.5,
      delay: 0.3
    });

    gsap.to('#action-btn', {
      opacity: 1,
      y: 0,
      ease: 'expo',
      duration: 1.5,
      delay: 0.6
    });

    // warp animation on btn click
    document.querySelector('#action-btn')
      .addEventListener('click', (e) => {
        gsap.to('#container', {
          opacity: 0
        });

        gsap.to(camera.position,
          {
            z: 25,
            ease: 'power3.inOut',
            duration: 1.5
          });

          gsap.to(camera.rotation,
            {
              x: Math.PI / 2,
              ease: 'power3.inOut',
              duration: 1.5,
            });

            gsap.to(camera.position,
              {
                y: 1000,
                ease: 'power3.in',
                duration: 1,
                delay: 1.5,
                onComplete: () => {
                  alert('finished');
                  this.router.navigate()
                }
              });
      })

      // responsiveness
      addEventListener('resize', () => {
        console.log('resize');
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
        renderer.setPixelRatio(devicePixelRatio);
      })

  }





}
