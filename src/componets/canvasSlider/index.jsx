import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ee from '../event'
import './index.css'
export default function CanvasSlider({ canvasList, curEditId, canvasHeight, canvasWidth }) {

    // 元素移动
    const move = (arr, startIndex, toIndex) => {
        arr = arr.slice();
        arr.splice(toIndex, 0, arr.splice(startIndex, 1)[0]);
        return arr;
    };
    const getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: 'none',
        // padding: grid * 2,
        // margin: `0 0 ${grid}px 0`,
        // 拖拽的时候背景变化
        background: isDragging ? 'lightgreen' : '#ffffff30',
        // styles we need to apply on draggables
        ...draggableStyle,
    });
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        ee.emit("CHANGEORDER", move(canvasList, result.source.index, result.destination.index))
        //setItems((pre) => move(pre, result.source.index, result.destination.index));
    };
    useEffect(() => {
        canvasList.map(canvasItem => {
            const { id, ctx } = canvasItem
            const thumbnail = document.getElementById(id)
            if (!thumbnail) return
            const tnCtx = thumbnail.getContext('2d')
            if (ctx === null) {
                thumbnail.height = 160
                thumbnail.width = 90
            } else {
                const scale = 0.3
                thumbnail.height = ctx.canvas.height * scale
                thumbnail.width = ctx.canvas.width * scale
                tnCtx.scale(scale, scale)
                tnCtx.drawImage(ctx.canvas, 0, 0)
            }
            return true
        })
    }, [canvasList]);
    const addNewCanvas = (e) => {
        const insertBefore = parseInt(e.currentTarget.className.match(/before-(\d+)/)[1])
        ee.emit("ADDNEWCANVAS", insertBefore)
    }
    const switchCanvas = (e) => {
        const switchToId = e.currentTarget.className.match(/wrapper-(\w+)/)[1]
        ee.emit("SWICTHCUREDIT", switchToId)
    }
    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <center>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => {
                            return (
                                <div
                                    //provided.droppableProps应用的相同元素.
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{ height: "80vh", overflowY: "auto" }}
                                >
                                    {canvasList.map((item, index) => {
                                        const { id } = item
                                        return (
                                            <Draggable key={'drag' + id} draggableId={"dragable-" + id} index={index}>
                                                {(provided, snapshot) => (
                                                    <>
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getItemStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style,
                                                            )}
                                                            id={"wrapper-" + id}
                                                            className={`thumbnail-wrapper ${"wrapper-" + id} ${curEditId === id ? "border-indigo-600 border-4" : "border-green-100"}  border-2 flex flex-1 items-center justify-center`}
                                                            onClick={switchCanvas}
                                                        >
                                                            <canvas id={id} height="160" width="90"></canvas>
                                                        </div>
                                                        <div key={id + 'add'} className={`${"before-" + (1 + index)} cursor-pointer bg-yellow-600 border-2 opacity-0 hover:opacity-75`}
                                                            onClick={addNewCanvas}
                                                        >+</div>
                                                    </>
                                                )}
                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                </div>
                            );
                        }}
                    </Droppable>
                </center>
            </DragDropContext >
            {/* <div className="flex flex-col overflow-y-auto h-full">
                <div className={`${"before-0"} bg-yellow-600 border-2 opacity-0 hover:opacity-75 flex items-center justify-center text-gray-800`}
                    onClick={addNewCanvas}
                >+</div>
                {
                    items.map((canvasItem, index) => {
                        const { id } = canvasItem
                        return (
                            <div className="flex flex-col"
                            >
                                <div key={id} id={"wrapper-" + id} className={`thumbnail-wrapper ${"wrapper-" + id} ${curEditId === id ? "border-indigo-600 border-4" : "border-green-100"}  border-2 flex flex-1 items-center justify-center`}
                                    onClick={switchCanvas}
                                >
                                    <canvas id={id} height="160" width="90"></canvas>

                                </div>
                                <div key={id + 'add'} className={`${"before-" + (1 + index)} cursor-pointer bg-yellow-600 border-2 opacity-0 hover:opacity-75`}
                                    onClick={addNewCanvas}
                                >+</div>
                            </div>
                        )

                    })
                }
            </div> */}
        </>
    )
}
