document.addEventListener('DOMContentLoaded', function() {
    let myp5;
    let footer = document.querySelector('.footer-content'); // Assuming 'footer' is the class name
    let footerHeight = footer.offsetHeight;
    function adjustCanvasSize() {
        if (myp5) {
            myp5.resizeCanvas(myp5.windowWidth, document.body.scrollHeight-(footerHeight/2));
            myp5.redraw();
        }
    }

    myp5 = new p5((p) => {
        let nodes = [];
        const nodeCount = 30; // Adjust the density of the nodes

        p.setup = () => {
            let canvas = p.createCanvas(p.windowWidth, document.body.scrollHeight-(footerHeight/2));
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
    fetch('../json/explorar.json')
        .then(response => response.json())
        .then(data => {
            const projectsContainer = document.querySelector('.carousel:first-of-type > .row');
            const articlesContainer = document.querySelector('.carousel:last-of-type > .row');

            data.aiProjects.forEach(project => {
                projectsContainer.innerHTML += `
                    <div class="col-md-4 mb-3">
                        <div class="item card">
                            <img src="${project.image}" class="card-img-top" alt="${project.alt}">
                            <div class="card-body">
                                <h5 class="card-title">${project.title}</h5>
                                <p class="card-text">${project.text}</p>
                            </div>
                        </div>
                    </div>
                `;
            });

            data.aiArticles.forEach(article => {
                articlesContainer.innerHTML += `
                    <div class="col-md-4 mb-3">
                        <div class="item card">
                            <img src="${article.image}" class="card-img-top" alt="${article.alt}">
                            <div class="card-body">
                                <h5 class="card-title">${article.title}</h5>
                                <p class="card-text">${article.text}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
            // Initialize "Show More" functionality after populating cards
            initializeShowMore('aiProjectsContainer', 'showMoreProjectsBtn');
            initializeShowMore('aiArticlesContainer', 'showMoreArticlesBtn');
            // Adjust canvas size after content is loaded
            adjustCanvasSize();
        })
        .catch(error => console.error('Error:', error));
    });

    function initializeShowMore(containerId, buttonId) {
        const container = document.getElementById(containerId);
        const showMoreBtn = document.getElementById(buttonId);
        const cardsToShow = 6;
        const cards = container.getElementsByClassName('col-md-4');
    
        // Initially hide cards exceeding the limit
        for (let i = cardsToShow; i < cards.length; i++) {
            cards[i].style.display = 'none';
        }
    
        // Show More functionality
        showMoreBtn.addEventListener('click', () => {
            let shownCount = 0;
            for (let card of cards) {
                if (card.style.display !== 'none') {
                    shownCount++;
                }
            }
    
            for (let i = shownCount; i < Math.min(shownCount + cardsToShow, cards.length); i++) {
                cards[i].style.display = '';
            }
    
            if (shownCount + cardsToShow >= cards.length) {
                showMoreBtn.style.display = 'none';
            }
        });
    }