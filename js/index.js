document.addEventListener('DOMContentLoaded', function() {
    let myp5;
    let footer = document.querySelector('.footer-content'); // Assuming 'footer' is the class name
    let footerHeight = footer.offsetHeight;
    function adjustCanvasSize() {
        if (myp5) {
            myp5.resizeCanvas(myp5.windowWidth, document.body.scrollHeight-(footerHeight));
            myp5.redraw();
        }
    }

    myp5 = new p5((p) => {
        let nodes = [];
        const nodeCount = 30; // Adjust the density of the nodes

        p.setup = () => {
            let canvas = p.createCanvas(p.windowWidth, document.body.scrollHeight-(footerHeight));
            canvas.position(0, 0);
            canvas.style('z-index', '-9'); // Place canvas behind content
            p.noLoop();
            // Apply blur effect
            p.drawingContext.filter = 'blur(10px)'; // Adjust the blur radius as needed

            for (let i = 0; i < nodeCount; i++) {
                nodes.push(createNode(p));
            }
        };

        p.draw = () => {
            p.clear();
            p.background(255, 127); // 50% transparency
            nodes.forEach((node) => {
                drawEdges(p, node, nodes);
                drawNode(p, node);
            });
        };

        p.windowResized = () => {
            adjustCanvasSize();
        };

        // ... createNode, drawNode, drawEdges functions ...
        function createNode(p) {
            return {
                x: p.random(p.width),
                y: p.random(p.height),
                radius: p.random(5, 10) // Randomize for variety
            };
        }

        function drawNode(p, node) {
            p.fill(p.color(127, 127, 213, 26)); // Soft Purple color
            p.noStroke();
            p.ellipse(node.x, node.y, node.radius * 2, node.radius * 2);
        }

        function drawEdges(p, node, nodes) {
            p.stroke(p.color(92, 172, 238, 26)); // Light Blue color
            p.strokeWeight(1);
        
            // Sort nodes by distance from the current node
            let sortedNodes = nodes
                .map(otherNode => {
                    return {
                        node: otherNode,
                        distance: p.dist(node.x, node.y, otherNode.x, otherNode.y)
                    };
                })
                .sort((a, b) => a.distance - b.distance);
        
            // Connect to the closest nodes, ensuring almost all nodes are connected
            for (let i = 1; i < sortedNodes.length; i++) {
                if (i <= sortedNodes.length * 0.50) { // Connect to 99% of closest nodes
                    let otherNode = sortedNodes[i].node;
                    p.line(node.x, node.y, otherNode.x, otherNode.y);
                }
            }
        }
    }, document.body);
    fetch('json/index.json')
        .then(response => response.json())
        .then(data => {
            function createCarouselItems(items, container, isProject = true) {
                let carouselHTML = '';
                let rowContent = '';
                let itemCount = 0;
                let activeAdded = false; // Flag to check if active class has been added

                items.forEach((item, index) => {
                    if (itemCount === 0) {
                        rowContent = `<div class="row">`;
                    }

                    rowContent += `
                        <div class="col-md-4">
                            <div class="card">
                                <img src="${item.image}" class="card-img-top" alt="${item.alt}">
                                <div class="card-body">
                                    <h5 class="card-title">${item.title}</h5>
                                    <p class="card-text">${item.text}</p>
                                    <a href="#" class="btn btn-secondary">Read More</a>
                                </div>
                            </div>
                        </div>`;

                    itemCount++;

                    if (itemCount === 3 || index === items.length - 1) {
                        rowContent += `</div>`;
                        let isActive = !activeAdded; // Only the first set of items should be active
                        carouselHTML += `<div class="carousel-item ${isActive ? 'active' : ''}">${rowContent}</div>`;
                        if (isActive) activeAdded = true; // Update flag
                        itemCount = 0;
                    }
                });

                container.innerHTML += carouselHTML;
            }

            createCarouselItems(data.featuredProjects, document.querySelector('#featuredProjectsCarousel .carousel-inner'), true);
            createCarouselItems(data.aiNews, document.querySelector('#aiNewsCarousel .carousel-inner'), false);
            // Adjust active carousel items after loading JSON data
            adjustActiveCarouselItems('#featuredProjectsCarousel');
            adjustActiveCarouselItems('#aiNewsCarousel');
            // Adjust canvas size after content is loaded
            adjustCanvasSize();
        })
        .catch(error => console.error('Error:', error));
});

function adjustActiveCarouselItems(carouselId) {
    const carousel = document.querySelector(carouselId);
    const carouselItems = carousel.querySelectorAll('.carousel-item');

    let firstItemActive = false;
    carouselItems.forEach((item, index) => {
        if (index === 0 && item.classList.contains('active')) {
            firstItemActive = true;
        } else {
            item.classList.remove('active');
        }
    });

    if (!firstItemActive) {
        carouselItems[0].classList.add('active');
    }
}

let myp5;
let footer = document.querySelector('.footer-content'); // Assuming 'footer' is the class name
let footerHeight = footer.offsetHeight;
function adjustCanvasSize() {
    if (myp5) {
        myp5.resizeCanvas(myp5.windowWidth, document.body.scrollHeight-(footerHeight));
        myp5.redraw();
    }
}

myp5 = new p5((p) => {
    let nodes = [];
    const nodeCount = 30; // Adjust the density of the nodes

    p.setup = () => {
        let canvas = p.createCanvas(p.windowWidth, document.body.scrollHeight-(footerHeight));
        canvas.position(0, 0);
        canvas.style('z-index', '-9'); // Place canvas behind content
        p.noLoop();
        // Apply blur effect
        p.drawingContext.filter = 'blur(10px)'; // Adjust the blur radius as needed

        for (let i = 0; i < nodeCount; i++) {
            nodes.push(createNode(p));
        }
    };

    p.draw = () => {
        p.clear();
        p.background(255, 127); // 50% transparency
        nodes.forEach((node) => {
            drawEdges(p, node, nodes);
            drawNode(p, node);
        });
    };

    p.windowResized = () => {
        adjustCanvasSize();
    };

    // ... createNode, drawNode, drawEdges functions ...
    function createNode(p) {
        return {
            x: p.random(p.width),
            y: p.random(p.height),
            radius: p.random(5, 10) // Randomize for variety
        };
    }

    function drawNode(p, node) {
        p.fill(p.color(127, 127, 213, 26)); // Soft Purple color
        p.noStroke();
        p.ellipse(node.x, node.y, node.radius * 2, node.radius * 2);
    }

    function drawEdges(p, node, nodes) {
        p.stroke(p.color(92, 172, 238, 26)); // Light Blue color
        p.strokeWeight(1);
    
        // Sort nodes by distance from the current node
        let sortedNodes = nodes
            .map(otherNode => {
                return {
                    node: otherNode,
                    distance: p.dist(node.x, node.y, otherNode.x, otherNode.y)
                };
            })
            .sort((a, b) => a.distance - b.distance);
    
        // Connect to the closest nodes, ensuring almost all nodes are connected
        for (let i = 1; i < sortedNodes.length; i++) {
            if (i <= sortedNodes.length * 0.50) { // Connect to 99% of closest nodes
                let otherNode = sortedNodes[i].node;
                p.line(node.x, node.y, otherNode.x, otherNode.y);
            }
        }
    }
}, document.body);
window.addEventListener('resize', adjustCanvasSize); // Adjust canvas size on window resize