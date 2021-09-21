import React, { useState, useEffect } from 'react'
import ee from '../event'
export default function Palette(props) {
    const colors = ["#aaffee", "#557783", "#e3e4e5",
        "#bc5477", "#bb7733", "#123456", "#456789", "#789abc", "#abcdef", "#234567", "#6744ab", "#41b3c4"];
    const [selectedColor, setSelectedColor] = useState("#aaffee")
    const [pageDuration, setpageDuration] = useState(5)
    useEffect(() => {
        const { curEditId, canvasList } = props
        setpageDuration(canvasList.find(c => c.id === curEditId).duration)
        console.log("123")
    }, [props.curEditId])
    return (

        <div className="palette p-10">

            <div className="rounded-full w-6 h-6 m-auto" style={{ backgroundColor: selectedColor }}></div>

            <ul className="flex justify-center w-40 flex-wrap m-auto">
                {
                    colors.map(color => {
                        return (
                            <li key={color} className="m-1 w-4 h-4 rounded-full" style={{ backgroundColor: color }}
                                onClick={(e) => {
                                    console.log(color)
                                    ee.emit("CHANGECOLOR", color)
                                    setSelectedColor(color)
                                }}
                            />
                        )
                    })
                }
                {/* <li> <input type="color" /></li> */}
            </ul>
            <div className="flex items-baseline mt-3">
                <span>duration：</span>
                <input type="number" value={pageDuration} min={1} max={10} step={0.5} className=" w-8" onInput={e => {
                    setpageDuration(e.target.value)
                    const { canvasList, curEditId } = props
                    console.log(canvasList)
                    canvasList.some(c => {
                        if (c.id === curEditId) {
                            c.duration = e.target.value
                            console.log(e.target.value)
                        }
                    })
                }} />
            </div>

        </div>
    )
}
