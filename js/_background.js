document.addEventListener('DOMContentLoaded', function() {
    let myp5;

    function adjustCanvasSize() {
        if (myp5) {
            myp5.resizeCanvas(myp5.windowWidth, document.body.scrollHeight);
            myp5.redraw();
        }
    }

    myp5 = new p5((p) => {
        let nodes = [];
        const nodeCount = 30; // Adjust the density of the nodes

        p.setup = () => {
            let canvas = p.createCanvas(p.windowWidth, document.body.scrollHeight);
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
            p.fill('#7F7FD5'); // Soft Purple color
            p.noStroke();
            p.ellipse(node.x, node.y, node.radius * 2, node.radius * 2);
        }

        function drawEdges(p, node, nodes) {
            p.stroke('#5CACEE'); // Light Blue color
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

    // Call this function after dynamically loading content
    // Example: After fetching and rendering JSON content
    fetch('../json/your-content.json')
        .then(response => response.json())
        .then(data => {
            // Code to dynamically generate content

            // Adjust canvas size after content is loaded
            adjustCanvasSize();
        })
        .catch(error => console.error('Error:', error));
});
