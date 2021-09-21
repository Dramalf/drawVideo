import React, { useEffect } from 'react'
import ee from '../event'
import './index.css'
export default function CanvasSlider(props) {
    useEffect(() => {
        const { canvasList } = props
        canvasList.map(canvasItem => {
            const { id, ctx } = canvasItem
            const thumbnail = document.getElementById(id)
            const tnCtx = thumbnail.getContext('2d')
            if (ctx === null) {
                thumbnail.height = 160
                thumbnail.width = 90
            } else {
                const scale = 0.4
                thumbnail.height = ctx.canvas.height * scale
                thumbnail.width = ctx.canvas.width * scale
                tnCtx.scale(scale, scale)
                tnCtx.drawImage(ctx.canvas, 0, 0)
            }
        })
    });
    const addNewCanvas = (e) => {
        const insertBefore = parseInt(e.currentTarget.className.match(/before-(\d+)/)[1])
        ee.emit("ADDNEWCANVAS", insertBefore)
    }
    const switchCanvas = (e) => {
        const switchToId = e.currentTarget.className.match(/wrapper-(\w+)/)[1]
        ee.emit("SWICTHCUREDIT", switchToId)
    }
    const { curEditId, canvasList } = props
    return (
        <div className="flex flex-col items-stretch p-2 overflow-y-auto h-full">
            <div className={`${"before-0"} border-yellow-700 border-2 opacity-0 hover:opacity-75 flex items-center justify-center text-gray-800`}
                onClick={addNewCanvas}
            >+</div>
            {
                canvasList.map((canvasItem, index) => {
                    const { id } = canvasItem
                    return (
                        <div className="flex flex-col" >
                            <div key={id} className={`thumbnail-wrapper ${"wrapper-" + id} ${curEditId === id ? "border-yellow-200" : "border-green-200"}  border-2 flex flex-1 items-center justify-center`}
                                onClick={switchCanvas}
                            >
                                <canvas id={id}></canvas>

                            </div>
                            <div key={id + 'add'} className={`${"before-" + (1 + index)} border-yellow-700 border-2 opacity-0 hover:opacity-75`}
                                onClick={addNewCanvas}
                            >+</div>
                        </div>
                    )

                })
            }

        </div>
    )
}
