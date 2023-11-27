let myp5;
let footer = document.querySelector('.footer-content'); // Assuming 'footer' is the class name
let footerHeight = footer.offsetHeight;
function adjustCanvasSize() {
    if (myp5) {
        myp5.resizeCanvas(myp5.windowWidth, document.body.scrollHeight-(footerHeight));
        myp5.redraw();
    }
}

document.addEventListener('DOMContentLoaded', function() {

    // Initialize p5 instance
    myp5 = new p5((p) => {
        let nodes = [];
        const nodeCount = 30; // Node density

        p.setup = () => {
            let canvas = p.createCanvas(window.innerWidth, document.body.scrollHeight - footer.offsetHeight);
            canvas.position(0, 0);
            canvas.style('z-index', '-9');
            p.noLoop();
            p.drawingContext.filter = 'blur(10px)'; // Adjust blur radius

            for (let i = 0; i < nodeCount; i++) {
                nodes.push(createNode(p));
            }
        };

        p.draw = () => {
            p.clear();
            p.background(255, 127); // Adjust transparency
            nodes.forEach((node) => {
                drawEdges(p, node, nodes);
                drawNode(p, node);
            });
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

    // Fetch community data and update table
    fetch('../json/comunidad.json')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('.table tbody');

            data.communityTopics.forEach(topic => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${topic.title}</td>
                        <td>${topic.author}</td>
                        <td>${topic.likes}</td>
                        <td>${topic.comments}</td>
                        <td>${topic.visits}</td>
                        <td>${topic.favorites}</td>
                    </tr>
                `;
            });
            adjustCanvasSize();
        })
        .catch(error => console.error('Error:', error));
});

// Global resize event listener
window.addEventListener('resize', adjustCanvasSize);
