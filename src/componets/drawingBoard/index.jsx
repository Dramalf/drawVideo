import React, { Component } from 'react';
import ee from '../event'
class CanvasBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            strokeStyle: "#123456",
            lineWidth: "16"
        }
    }
    componentDidMount() {
        const context = this.drawCanvas()

        //        ee.emit("FINISHDRAW", context)
        this.addPaintEventListener()
    }

    componentDidUpdate() {

        const context = this.drawCanvas()

        //ee.emit("FINISHDRAW", context)
    }
    componentWillUnmount() {
        this.removePaintEventListener()
    }
    drawCanvas = () => {
        const { curCanvas, canvasHeight, canvasWidth } = this.props
        const { ctx: editCtx } = curCanvas
        const canvasBoard = document.getElementById("painter")
        const context = canvasBoard.getContext('2d')
        context.clearRect(0, 0, canvasWidth, canvasHeight)
        context.fillStyle = '#fff'
        context.fillRect(0, 0, canvasWidth, canvasHeight)
        editCtx && context.drawImage(editCtx.canvas, 0, 0)
        return context
    }
    removePaintEventListener = () => {
        const canvasBoard = document.getElementById("painter")
        canvasBoard.onmousedown = null
        canvasBoard.onmousemove = null
        canvasBoard.onmousedown = null
        ee.removeListener("CHANGECOLOR", this.changeStrokeStyle)
        ee.removeListener("CHANGELINEWIDTH", this.changeLineWidth)
    }
    addPaintEventListener = () => {
        ee.addListener("CHANGECOLOR", this.changeStrokeStyle)
        ee.addListener("CHANGELINEWIDTH", this.changeLineWidth)
    }
    changeLineWidth = (lineWidth) => {
        this.setState({ lineWidth: lineWidth })
        console.log(lineWidth)
    }
    changeStrokeStyle = (color) => {
        this.setState({ strokeStyle: color });
    }
    painterBegin = (e) => {
        const canvasBoard = e.currentTarget
        const context = canvasBoard.getContext('2d')
        context.beginPath();
        context.moveTo(e.offsetX, e.offsetY);
        const { strokeStyle, lineWidth } = this.state
        context.strokeStyle = strokeStyle
        context.lineWidth = lineWidth;
        context.lineCap = "round"
        context.lineJoin = "round"
        canvasBoard.onmousemove = function (e) {
            context.lineTo(e.offsetX, e.offsetY);

            context.stroke();
        };
    }



    paintEnd = (e) => {
        const context = e.currentTarget.getContext('2d')
        context.closePath();
        console.log(234)
        ee.emit("FINISHDRAW", context)
        e.currentTarget.onmousemove = null
    }
    exportImageData = () => {
        const canvasBoard = document.getElementById("canvasBoard");
        const ctx = canvasBoard.getContext('2d')
        return ctx
    }
    render() {
        return (<div id="canvasBoard-wrapper" className="flex justify-center">
            <canvas
                id="painter"
                height={this.props.canvasHeight}
                width={this.props.canvasWidth}

                onMouseDown={this.painterBegin}
                onMouseUp={this.paintEnd}
            ></canvas>
        </div>
        );
    }
}

export default CanvasBoard;