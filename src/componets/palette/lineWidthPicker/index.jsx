import React, { useEffect, useState } from 'react'
const defaultonChange = (e) => {
    console.log(e)
}
export default function LineWidthPick({ width = 60, max = 30, min = 2, step = 1, outerColor = "#e3e4e5", innerColor = "#56789a", onChange = defaultonChange }) {
    const [innerR, setInnerR] = useState(width / 4)
    const [isClicked, setisClick] = useState(false)
    useEffect(() => {
        const canvas = document.getElementById("circlrPicker")
        canvas.width = width
        canvas.height = width
        drawInnerCircle(innerR)
        console.log('in effect')
    }, [])
    useEffect(() => {
        const canvas = document.getElementById("circlrPicker")
        canvas.addEventListener('mousemove', handlePickerMouseMove)
        canvas.addEventListener('mousedown', handlePickerMouseDown)
        document.addEventListener('mouseup', handlePickerMouseUp)
        canvas.addEventListener('click', handlePickerClick)
        return () => {
            canvas.removeEventListener('mousemove', handlePickerMouseMove)
            canvas.removeEventListener('mousedown', handlePickerMouseDown)
            canvas.removeEventListener('click', handlePickerClick)
            document.removeEventListener('mouseup', handlePickerMouseUp)
        }
    })
    useEffect(() => {
        isClicked && drawInnerCircle(innerR)
        console.log("effect innerR")
    }, [innerR])
    const handlePickerMouseUp = () => {
        setisClick(false)
    }
    const handlePickerMouseMove = (e) => {

        if (e.offsetX === width - 1 || e.offsetX === 1) {
            setisClick(false)
            isClicked && onChange(max)
        }
        const newR = Math.abs(width / 2 - e.offsetX) > width / 2 ? width / 2 : Math.abs(width / 2 - e.offsetX)
        setInnerR(newR)
    }
    const handlePickerClick = (e) => {
        const newR = Math.abs(width / 2 - e.offsetX) > width / 2 ? width : Math.abs(width / 2 - e.offsetX)
        setInnerR(newR)
        drawInnerCircle(newR)
        console.log('click')
        const i = Math.floor((newR * 2 / width * (max - min)) / step) * step + min
        onChange(i)
    }
    const handlePickerMouseDown = (e) => {
        drawInnerCircle(innerR)
        console.log('mousedown')
        setisClick(true)

    }
    const drawInnerCircle = (radius) => {
        if (radius) {
            const canvas = document.getElementById("circlrPicker")
            const ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, width, width)
            ctx.beginPath()
            ctx.arc(width / 2, width / 2, width / 2, 0, 2 * Math.PI);
            ctx.fillStyle = outerColor
            ctx.fill()
            ctx.closePath()
            ctx.beginPath()
            ctx.arc(width / 2, width / 2, radius, 0, 2 * Math.PI);
            ctx.fillStyle = innerColor;//设置填充颜色
            ctx.fill();//开始填充
            ctx.closePath()
        }

    }
    return (
        <canvas id="circlrPicker"></canvas>
    )
}
