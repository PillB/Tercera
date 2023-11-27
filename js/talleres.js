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
        window.addEventListener('resize', adjustCanvasSize); // Adjust canvas size on window resize
    }, document.body);
    fetch('../json/talleres.json')
        .then(response => response.json())
        .then(data => {
            // Correct the selector to match the HTML structure.
            // The container is the direct parent of the workshop items.
            const container = document.querySelector('.carousel > .row');

            // Check if container is found
            if (!container) {
                console.error('Container not found for workshops');
                return;
            }

            // Adding each item to the container
            data.forEach(item => {
                container.innerHTML += `
                    <div class="col-md-4 mb-3" data-topic="${item.topic.toLowerCase()}"> 
                        <div class="card">
                            <img src="${item.image}" class="card-img-top" alt="${item.alt}">
                            <div class="card-body">
                                <h5 class="card-title">${item.title}</h5>
                                <p class="card-text">${item.text}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
            // Function to populate topic filter options
            populateTopicFilter(data);    
            filterWorkshops();
            initializeShowMore();
            setupFilterListener();
            // Adjust canvas size after content is loaded
            adjustCanvasSize();
        })
        .catch(error => console.error('Error:', error));

    // Toggle filter section
    document.querySelector('.filter-toggle').addEventListener('click', () => {
        const filters = document.getElementById('workshopFilters');
        filters.style.display = filters.style.display === 'none' ? 'block' : 'none';
    });

    function setupFilterListener() {
        // Filter functionality
        document.getElementById('topic').addEventListener('change', function() {
            filterWorkshops();
            initializeShowMore(); // Re-initialize show more after filtering
            // Adjust canvas size after content is loaded
            adjustCanvasSize();
        });
    }

    function filterWorkshops() {
        const selectedTopic = document.getElementById('topic').value;
        const workshops = document.querySelectorAll('.col-md-4');

        workshops.forEach(workshop => {
            const topic = workshop.getAttribute('data-topic');
            if ((selectedTopic === 'all') || (topic === selectedTopic)) {
                workshop.style.display = '';
            } else {
                workshop.style.display = 'none';
            };
        })
    }

    // Function to populate topic filter options
    function populateTopicFilter(data) {
        const topicSelect = document.getElementById('topic');
        const existingOptions = new Set();
    
        // Collect existing topics from HTML
        document.querySelectorAll('#topic option').forEach(option => {
            if (option.value && option.value !== 'all') {
                existingOptions.add(option.value.toLowerCase());
            }
        });
    
        // Add new topics from JSON data
        data.forEach(workshop => {
            existingOptions.add(workshop.topic.toLowerCase());
        });
    
        // Clear existing options except the 'all' option
        topicSelect.innerHTML = '<option value="all">Todos</option>';
    
        // Populate the dropdown with combined unique topics
        existingOptions.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic;
            option.textContent = topic.charAt(0).toUpperCase() + topic.slice(1); // Capitalize first letter for display
            topicSelect.appendChild(option);
        });
    }
    function initializeShowMore() {
        const cardsToShow = 6;
        const cards = document.querySelectorAll('.col-md-4');
        const showMoreBtn = document.getElementById('showMoreBtn');
        const selectedTopic = document.getElementById('topic').value;

        // Initially hide all cards and then show only the first 'cardsToShow' cards
        cards.forEach(card => card.classList.add('d-none'));
    
        let shownCount = 0;
        cards.forEach(card => {
            const topic = card.getAttribute('data-topic');
            if ((selectedTopic === 'all' || topic === selectedTopic) && shownCount < cardsToShow) {
                card.classList.remove('d-none');
                shownCount++;
            }
        });
        showMoreBtn.classList.remove('d-none'); // Make sure the button is visible

        showMoreBtn.addEventListener('click', () => {
            let currentlyShown = Array.from(cards).filter(card => !card.classList.contains('d-none')).length;
            cards.forEach((card, index) => {
                if (index >= currentlyShown && index < currentlyShown + cardsToShow) {
                    card.classList.remove('d-none');
                }
            });

            if (currentlyShown + cardsToShow >= cards.length) {
                showMoreBtn.classList.add('d-none');
            }
            // Adjust canvas size after content is loaded
            adjustCanvasSize();
        });
    }

});