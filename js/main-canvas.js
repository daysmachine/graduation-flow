/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-03-11 14:42:55
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-05-05 15:36:25
 */

/**
 * This object contains all the app's runtime data
 * and P5 rendering hooks.
 */
class MainCanvas extends Canvas {

    nodes = []

    // PRIVATE
    #dragging = false
    #currently_dragged = null
    #drag_offx = 0
    #drag_offy = 0

    _setup(p5) {
        super._setup(p5)
        FlowNode.font = p5.loadFont('css/font/robotoslab/robotoslab.ttf')
    }
    
    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked to draw each new frame by P5.
     * Framerate is ~20 FPS by default
     * 
     * If the nodes have been modified in any way since last draw,
     * this should redraw the tree. 
     * 
     * Currently, we just redraw every frame since that is safer.
     */
    draw(p5) {
    
        p5.clear()

        // Draw prereq indicators
        // We do this before nodes so the nodes render on top the arrows
        this.nodes.forEach((dependentNode) => {
            
            dependentNode.prereqs.forEach((prereq) => {

                const prereqNode = this.findNodeByClassCode(prereq)

                if(prereqNode) {

                    // Draw an arrow from the prereq node to the dependent noe
                    drawArrow(p5, 
                        prereqNode.getCenter(), 
                        dependentNode.getIntersection(prereqNode.getCenter()), 
                        prereqNode.tabColor
                    )

                }
                
            })
            
        })

        // Draw all nodes
        this.nodes.forEach(node => node.draw(p5))
    
    }
    
    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked whenever the mouse is:
     *      Pressed (ie. starting to click) 
     * anywhere in the browser
     */
    _mousePressed(p5) {
    
        if (popupManager.popupVisible()) {

            // TODO: remove these magic number offsets in the Y coord
            let dim = popupManager.getCurPopupDim()
            if(
                p5.mouseX <= dim.left ||
                p5.mouseY <= dim.top - 108 ||
                p5.mouseX >= dim.left + dim.width ||
                p5.mouseY >= dim.top - 108 + dim.height
            ) {
                popupManager.hideLastPopup()
            }
    
        }
        
        if (!popupManager.popupVisible() && this.#currently_dragged == null) {

            for (let node of this.nodes) {
                if (node.isInTabVolume(p5.mouseX, p5.mouseY)) {
                    this.#drag_offx = p5.mouseX - node.x
                    this.#drag_offy = p5.mouseY - node.y
                    this.#currently_dragged = node
                }
            }
            
        }
    
    }
    
    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked whenever the mouse is:
     *      Dragged (ie. moved during a press but before release) 
     * anywhere in the browser
     */
    _mouseDragged(p5) {
    
        this.#dragging = true
    
        if (this.#currently_dragged != null) {
            this.#currently_dragged.x = (p5.mouseX - this.#drag_offx)
            this.#currently_dragged.y = (p5.mouseY - this.#drag_offy)
        }
    
    }
    
    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked whenever the mouse is:
     *      Released (ie. ending a click or drag) 
     * anywhere in the browser
     */
    _mouseReleased(p5) {
    
        if (!this.#dragging && !popupManager.popupVisible()) {
    
            for (let node of this.nodes) {
                if (node.isInVolume(p5.mouseX, p5.mouseY)) {

                    document.getElementById("c-prefixnum-modify").value = node.classPrefixNumber
                    document.getElementById("c-name-modify").value = node.className
                    document.getElementById("c-unit-modify").value = node.classUnit
                    document.getElementById("c-major-modify").value = node.classMajor
                    document.getElementById("c-description-modify").value = node.classDescription
                    document.getElementById("c-color-modify").value = node.tabColor
                    document.getElementById("c-prereq-modify").value = node.prereqs.join(',')

                    selectNode(node)
                    viewNode()
                    break
                }
            }
    
        }
    
        this.#dragging = false
        this.#currently_dragged = null
    
    }

    askToReset() {
        if(window.confirm('Are you sure you want to reset the canvas?'))
            this.reset()
    }

    saveToBrowser(key) {
        const saveData = this.toJson()
        localStorage.setItem(key, saveData)
    }

    saveToBrowserPrompt() {
        this.saveToBrowser(prompt('What would you like to name the save?', 'GRADFLOW-DATA-LOCAL'))
    }

    loadFromBrowser(key) {
        const saveData = localStorage.getItem(key)
        if(saveData)
            this.fromJson(saveData)
        return saveData != undefined
    }

    loadFromBrowserPrompt() {
        if (!this.loadFromBrowser(promt('What is the name of the save you would like to load?')))
            alert("No save data found!")
    }
    
} 


Object.assign(MainCanvas.prototype, NodesList) // Node List functionality mixin
const mainCanvas = new MainCanvas()
Canvas.injectInstance(mainCanvas, "canvas-container", "canvas-region")

// Auto load the last canvas when the canvas page is loaded
window.addEventListener('load', (ev) => {
    mainCanvas.loadFromBrowser('GRADFLOW-DATA-LOCAL')
})

// TEST NODES
// TODO: remove from final build of website
let testNodeColors = ["#800000", "#EE82EE", "#00FFFF", "#008000", "#FFA500"]
for(let i = 0; i < 10; ++i) {
    let node = new FlowNode(i * 100, 0)
    node.tabColor = testNodeColors[i % testNodeColors.length]
    mainCanvas.addNode(node)
}
