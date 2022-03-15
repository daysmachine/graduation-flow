/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-03-11 14:42:55
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-03-15 16:07:40
 */


// This file contains JS functions to be invoked by HTML buttons.
// 

function onClickCreateCustomNode() {
    // let btn = document.getElementById("btn-create-custom")
    let popup = document.getElementById("create-node-form-body")

    let customNode = new FlowNode(0, 300)
    customNode.className = document.getElementById("c-name-create").value
    customNode.classCode = document.getElementById("c-major-create").value
    customNode.tabColor = document.getElementById("c-color-create").value
    mainCanvas.addNode(customNode)
    mainCanvas.hideLastPopup()
    popup.reset()

}

function onClickCreate() {
    // let btn = document.getElementById("btn-create")
    // let popup = document.getElementById("create-node-form")
    
    mainCanvas.showPopup("create-node-form")

}

// Target HTML Element: modify-node-form
// Used for the button to delete the selected node
function onClickDeleteSelectedNode() {
    let popup = document.getElementById("modify-node-form-body")
    
    mainCanvas.removeSelectedNode()
    mainCanvas.hideLastPopup()
    popup.reset()
}

// Target HTML Element: modify-node-form
// Used to confirm modifications to the selected node
function onClickModifyNode() {
    let popup = document.getElementById("modify-node-form-body")

    mainCanvas.realizeNodeModifications() 
    mainCanvas.hideLastPopup()
    popup.reset()
}
