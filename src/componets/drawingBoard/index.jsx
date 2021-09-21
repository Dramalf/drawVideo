import React, { Component } from 'react';
import ee from '../event'
class CanvasBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            strokeStyle: "#aaffee"
        }
    }
    componentDidMount() {
        const { canvasList, curEditId } = this.props
        const { strokeStyle } = this.state
        const wrapper = document.getElementById("canvasBoard-wrapper")

        const { ctx: editCtx } = canvasList.find(c => c.id === curEditId)
        const canvasBoard = document.createElement('canvas')
        canvasBoard.height = 400;
        canvasBoard.width = 224;
        const context = canvasBoard.getContext('2d')
        editCtx && context.drawImage(editCtx.canvas, 0, 0)
        context.fillStyle = '#fff'
        !editCtx && context.fillRect(0, 0, 224, 400)
        wrapper.innerHTML = null;
        wrapper.appendChild(canvasBoard)
        canvasBoard.classList.add("scale-150")
        canvasBoard.onmousedown = (e) => {
            console.log(e.currentTarget)
            context.beginPath();
            context.moveTo(e.offsetX, e.offsetY);
            canvasBoard.onmousemove = function (e) {
                context.lineTo(e.offsetX, e.offsetY);
                context.strokeStyle = strokeStyle
                context.lineWidth = 2;
                context.stroke();
            };
        }
        canvasBoard.onmouseup = function () {
            context.closePath();
            ee.emit("FINISHDRAW", context)
            document.onmousemove = function () {
                return false;
            }
        }
        ee.addListener("CHANGECOLOR", this.changeStrokeStyle)
    }
    changeStrokeStyle = (color) => {
        this.setState({ strokeStyle: color });
    }
    componentWillUnmount() {
        ee.removeListener("CHANGECOLOR", this.changeStrokeStyle)
    }
    componentDidUpdate() {
        const { canvasList, curEditId } = this.props
        const { strokeStyle } = this.state
        const wrapper = document.getElementById("canvasBoard-wrapper")
        const { ctx: editCtx } = canvasList.find(c => c.id === curEditId)
        const canvasBoard = document.createElement('canvas')
        canvasBoard.height = 400;
        canvasBoard.width = 225;
        const context = canvasBoard.getContext('2d')
        editCtx && context.drawImage(editCtx.canvas, 0, 0)
        context.fillStyle = '#fff'
        !editCtx && context.fillRect(0, 0, 224, 400)
        wrapper.innerHTML = null;
        wrapper.appendChild(canvasBoard)
        canvasBoard.onmousedown = (e) => {
            context.beginPath();
            context.moveTo(e.offsetX, e.offsetY);
            document.onmousemove = function (e) {
                context.lineTo(e.offsetX, e.offsetY);
                context.strokeStyle = strokeStyle
                context.lineWidth = 2;
                context.stroke();
            };
        }
        canvasBoard.onmouseup = function () {
            context.closePath();
            ee.emit("FINISHDRAW", context)
            document.onmousemove = function () {
                return false;
            }
        }
        canvasBoard.classList.add("scale-150")
    }
    exportImageData = () => {
        const canvasBoard = document.getElementById("canvasBoard");
        const ctx = canvasBoard.getContext('2d')
        return ctx
    }
    render() {
        return (<div id="canvasBoard-wrapper" className="flex justify-center">
        </div>
        );
    }
}

export default CanvasBoard;