import React, { useState, useEffect } from 'react'
import LineWidthPicker from './lineWidthPicker';
import ee from '../event'
export default function Palette({ curEditId, canvasList }) {
    const colors = ["#aaffee", "#557783", "#e3e4e5",
        "#bc5477", "#bb7733", "#123456", "#456789", "#789abc", "#abcdef", "#234567", "#6744ab", "#41b3c4"];
    const [selectedColor, setSelectedColor] = useState("#123456")
    const [pageDuration, setpageDuration] = useState(5)
    useEffect(() => {
        setpageDuration(canvasList.find(c => c.id === curEditId).duration)
    }, [])
    return (

        <div className="palette p-10">

            <div className="rounded-full w-6 h-6 m-auto" style={{ backgroundColor: selectedColor }}></div>

            <ul className="flex justify-center w-40 flex-wrap m-auto">
                {
                    colors.map(color => {
                        return (
                            <li key={color} className="m-1 w-4 h-4 rounded-full" style={{ backgroundColor: color }}
                                onClick={(e) => {
                                    ee.emit("CHANGECOLOR", color)
                                    setSelectedColor(color)
                                }}
                            />
                        )
                    })
                }
                <li> <input type="color" className="" onChange={(e) => {
                    const color = e.target.value
                    setSelectedColor(color)
                    ee.emit("CHANGECOLOR", color)
                }} /></li>
            </ul>
            <div className="flex items-baseline mt-3">
                <span className="text-red-200">duration：</span>
                <input type="number" value={pageDuration} min={1} max={10} step={0.5} className=" w-12" onInput={e => {
                    setpageDuration(e.target.value)
                    canvasList.some(c => {
                        if (c.id === curEditId) {
                            c.duration = e.target.value
                            return true
                        } else {
                            return false
                        }
                    })
                }} />
            </div>
            <div className="flex items-baseline mt-3">
                <span className="text-red-200">lineWidth:</span>
                <LineWidthPicker width={30} max={30} min={6} step={1} onChange={(lineWidth) => {
                    ee.emit("CHANGELINEWIDTH", lineWidth)
                }} />
            </div>

        </div>
    )
}
