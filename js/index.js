document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");
    const navLinks = document.querySelectorAll(".nav-link");

    // Toggle the navigation menu when the hamburger menu is clicked
    navbarToggler.addEventListener("click", function () {
      navbarCollapse.classList.toggle("show");
    });

    // Toggle the navigation menu when the button is clicked again
    navbarToggler.addEventListener("click", function () {
      if (navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
      } else {
        navbarCollapse.classList.add("show");
      }
    });

    // Hide the navigation menu when a menu item is clicked
    navLinks.forEach(function (navLink) {
      navLink.addEventListener("click", function () {
        navbarCollapse.classList.remove("show");
      });
    });

    // Hide the navigation menu when clicking outside the menu
    document.addEventListener("click", function (event) {
      if (!navbarToggler.contains(event.target) && !navbarCollapse.contains(event.target)) {
        navbarCollapse.classList.remove("show");
      }
    });
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
            // Function to create carousel items from the data
            function createCarouselItems(items, container) {
                let numCardsInLastCarouselItem = container.querySelectorAll('.carousel-item:last-child .col-md-4').length;
                
                items.forEach((item, index) => {
                    // Create a new carousel item if the current index is a multiple of 3 or it's the first item
                    if ((numCardsInLastCarouselItem + index) % 3 === 0) {
                        const carouselItem = document.createElement('div');
                        carouselItem.classList.add('carousel-item');
                        
                        if ((numCardsInLastCarouselItem + index) === 0) {
                            carouselItem.classList.add('active'); // Activate the first item
                        }
                        
                        const row = document.createElement('div');
                        row.classList.add('row');
                        carouselItem.appendChild(row);
                        container.appendChild(carouselItem);
                    }
                    
                    // Create a new col-md-4 element for each item
                    const colMd4 = document.createElement('div');
                    colMd4.classList.add('col-md-4');
                    
                    // Create the card element
                    const card = document.createElement('div');
                    card.classList.add('card');
                    
                    // Create the card image
                    const img = document.createElement('img');
                    img.src = item.image;
                    img.alt = item.alt;
                    img.classList.add('card-img-top');
                    
                    // Create the card body
                    const cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');
                    
                    // Create card title and text
                    const cardTitle = document.createElement('h5');
                    cardTitle.classList.add('card-title');
                    cardTitle.textContent = item.title;
                    
                    const cardText = document.createElement('p');
                    cardText.classList.add('card-text');
                    cardText.textContent = item.text;
                    
                    // Create read more button
                    const readMoreBtn = document.createElement('a');
                    readMoreBtn.href = '#';
                    readMoreBtn.classList.add('btn', 'btn-secondary');
                    readMoreBtn.textContent = 'Leer más';
                    
                    // Append elements to the card and col-md-4
                    cardBody.appendChild(cardTitle);
                    cardBody.appendChild(cardText);
                    cardBody.appendChild(readMoreBtn);
                    card.appendChild(img);
                    card.appendChild(cardBody);
                    colMd4.appendChild(card);
                    
                    // Append col-md-4 to the current row
                    container.querySelector('.carousel-item:last-child .row').appendChild(colMd4);
                });
            }                              
            createCarouselItems(data.featuredProjects, document.querySelector('#featuredProjectsCarousel .carousel-inner'));
            createCarouselItems(data.aiNews, document.querySelector('#aiNewsCarousel .carousel-inner'));
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