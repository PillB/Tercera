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
            const projectCarousel = document.querySelector('#featuredProjectsCarousel .carousel-inner');
            const newsCarousel = document.querySelector('#aiNewsCarousel .carousel-inner');

            // Function to create carousel items v2
            function createCarouselItems(items, container, isProject = true) {
                let carouselHTML = '';
                let rowContent = '';
                let itemCount = 0;
                let isFirstItem = container.children.length === 0; // Check if there are pre-existing items

                items.forEach((item, index) => {
                    // Start a new row for every 3 items
                    if (itemCount === 0) {
                        rowContent = `<div class="row">`;
                    }

                    // Add the item to the row
                    rowContent += isProject ? `
                        <div class="col-md-4">
                            <div class="card">
                                <img src="${item.image}" class="card-img-top" alt="${item.alt}">
                                <div class="card-body">
                                    <h5 class="card-title">${item.title}</h5>
                                    <p class="card-text">${item.text}</p>
                                    <a href="#" class="btn btn-secondary">Read More</a>
                                </div>
                            </div>
                        </div>
                    ` : `
                        <div class="col-md-4">
                            <div class="news-item card">
                                <img src="${item.image}" alt="${item.alt}">
                                <h5>${item.title}</h5>
                                <p>${item.text}</p>
                                <a href="#" class="btn btn-link">Read More</a>
                            </div>
                        </div>
                    `;

                    itemCount++;

                    // Close the row and add to carouselHTML after every 3 items or at the end
                    if (itemCount === 3 || index === items.length - 1) {
                        rowContent += `</div>`; // Close the row
                        carouselHTML += `<div class="carousel-item ${isFirstItem && index < 3 ? 'active' : ''}">${rowContent}</div>`;
                        isFirstItem = false;
                        itemCount = 0; // Reset item count for the next row
                    }
                });

                container.innerHTML += carouselHTML;
            }

            createCarouselItems(data.featuredProjects, projectCarousel, true);
            createCarouselItems(data.aiNews, newsCarousel, false);
            // Adjust canvas size after content is loaded
            adjustCanvasSize();
        })
        .catch(error => console.error('Error:', error));
});

window.addEventListener('resize', adjustCanvasSize); // Adjust canvas size on window resize