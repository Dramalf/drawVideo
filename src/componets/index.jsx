import React, { useRef, useState, useEffect } from 'react'
import CanvasBoard from './drawingBoard'
import CanvasSlider from './canvasSlider'
import Palette from './palette'
import ResultDialog from './resultDialog'
import Dropdown from '@alifd/next/lib/dropdown';
import '@alifd/next/lib/dropdown/style';
import Select from '@alifd/next/lib/select';
import '@alifd/next/lib/select/style';
import ee from './event'
// import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { nanoid } from 'nanoid'


export default function Demo({ loadedFFmpeg = () => { }, beginComposite = () => { }, finishComposite = () => { } }) {
    const initCanvasList = () => {
        const canvas = document.createElement('canvas')
        canvas.height = 400
        canvas.width = 225
        const firstCtx = canvas.getContext('2d')
        return (
            [
                {
                    id: 'c1',
                    ctx: firstCtx,
                    duration: 5
                },
            ])
    }
    const fetchFFmpeg = async () => {
        const { createFFmpeg } = window.FFmpeg
        const ffmpeg = createFFmpeg({
            //corePath: "../../node_modules/@ffmpeg/core/dist/ffmpeg-core.js",
            log: true,
        });
        await ffmpeg.load()
        window.ffmpeg = ffmpeg
        loadedFFmpeg()
        return ffmpeg
    }
    //check loaded ffmpeg or not,interval 3s
    useEffect(() => {
        let loadFFmpeg = setInterval(() => {
            if (window.FFmpeg && !window.ffmpeg) {
                fetchFFmpeg()
            }
            if (window.ffmpeg) {
                clearInterval(loadFFmpeg)
            }
        }, 3 * 1000);
    }, [])
    useEffect(() => {
        //addNewCanvas(0)
    })
    //event control
    useEffect(() => {
        ee.addListener("ADDNEWCANVAS", addNewCanvas)
        ee.addListener("FINISHDRAW", updateCtx)
        ee.addListener("SWICTHCUREDIT", switchCanvas)
        ee.addListener("CHANGEORDER", updateOrder)
        document.addEventListener("keydown", handleKeydown)
        return () => {
            ee.removeListener("ADDNEWCANVAS", addNewCanvas)
            ee.removeListener("FINISHDRAW", updateCtx)
            ee.removeListener("SWICTHCUREDIT", switchCanvas)
            ee.removeListener("CHANGEORDER", updateOrder)
            document.removeEventListener("keydown", handleKeydown)
        }
    });
    const [visible, setVisible] = useState(false)
    const [result, setResult] = useState()
    const handleKeydown = (e) => {
        if (e.repeat) {
            return;
        }
        const keyCode = e.keyCode;
        switch (keyCode) {
            case 46:
                deleteCanvas(curEditId)
                break;

            default:
                break;
        }
    }
    const updateOrder = (newList) => {
        setCanvasList([...newList])
    }
    const deleteCanvas = (cid) => {
        let tempList = canvasList
        if (canvasList.length !== 1) {
            setCanvasList([...tempList.filter((t, i, a) => {
                if (t.id === cid) {
                    const newEditId = a[i === 0 ? 1 : i - 1].id
                    setCurEditId(newEditId)
                    return false
                } else {
                    return true
                }
            })])
        }
    }
    const addNewCanvas = (sn) => {
        let tempList = canvasList
        const canvas = document.createElement('canvas')
        canvas.height = canvasHeight
        canvas.width = canvasWidth
        const ctx = canvas.getContext('2d')
        tempList.splice(sn, 0, {
            id: nanoid(3),
            ctx: ctx,
            duration: 5
        })
        setCanvasList([...tempList])
    }
    const updateCtx = (newctx) => {
        let tempList = canvasList
        tempList.some(c => {
            if (c.id === curEditId) {
                c.ctx.drawImage(newctx.canvas, 0, 0)
                return true
            }
        })
        setCanvasList([...tempList])
    }
    const switchCanvas = (e) => {
        setCurEditId(e)
    }
    //composite canvas to video
    const composite = async () => {
        beginComposite()
        const ffmpeg = window.ffmpeg
        const { fetchFile } = window.FFmpeg
        const pageData = getPageData()
        const fileList = pageData.map(page => {
            const { id, ctx } = page
            return `file ${id}.mp4`
        })
        ffmpeg.FS('writeFile', 'concat.txt', fileList.join('\n'))
        const img = document.createElement('img')
        img.width = canvasWidth;
        img.height = canvasHeight;
        await (async function () {
            for (let i = 0; i < pageData.length; i++) {
                async function compositePart() {
                    const { duration, base64, id } = pageData[i]
                    img.src = base64;
                    ffmpeg.FS('writeFile', `${id}.png`, await fetchFile(img.src))
                    await ffmpeg.run('-r', '15', '-f', 'image2', '-loop', '1', '-i', `${id}.png`, '-s', `${canvasWidth * 2}x${canvasHeight * 2}`, '-pix_fmt', 'yuvj420p', '-t', `${duration}`, '-vcodec', 'libx264', `${id}.mp4`)
                }
                await compositePart()
            }
        })()
        await ffmpeg.run('-f', 'concat', '-i', 'concat.txt', '-c', 'copy', 'result.mp4')
        const data = await ffmpeg.FS('readFile', 'result.mp4')
        const video = document.getElementById("result-video")
        video.height = 400;
        video.width = 224;
        video.controls = true;
        video.autoplay = true;
        video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        setVisible(true)
        setResult(video.src)
        finishComposite()
    }
    const renderRusltContent = () => {
        return (<div>
            <video id="result-video"></video>
        </div>)
    }
    const getPageData = () => {
        const canvasPages = canvasList.filter(c => c.ctx).map(page => {
            const { id, duration, ctx } = page
            return {
                id,
                duration,
                base64: ctx.canvas.toDataURL("image/png")
            }
        })
        return canvasPages
    }
    const changeHWRatio = (ratio) => {
        let ch = 400, cw = 225;
        switch (ratio) {
            case "9-16":
                ch = 400
                cw = 225
                break;
            case "1-1":
                ch = 400
                cw = 400
                break;
            case "3-4":
                ch = 400
                cw = 300
                break;
            default:
                break;
        }
        setCanvasHeight(ch)
        setcanvasWidth(cw)
        canvasList.map(c => {
            const { ctx } = c
            if (ctx) {
                ctx.canvas.height = ch
                ctx.canvas.width = cw

            }
        })
    }
    const [canvasList, setCanvasList] = useState(initCanvasList());
    const drawingCanvas = useRef(null)
    const [curEditId, setCurEditId] = useState('c1');
    const [canvasHeight, setCanvasHeight] = useState(400)
    const [canvasWidth, setcanvasWidth] = useState(225)
    const Option = Select.Option;
    return (
        <div className="flex flex-row justify-between">
            <div className="slider-part w-32 border-2 border-gray-400 mr-4" style={{ height: "80vh" }}>
                <CanvasSlider canvasList={canvasList} curEditId={curEditId} canvasHeight={canvasHeight} canvasWidth={canvasWidth} />
            </div>
            <div style={{ height: "80vh" }} className="cb-part flex-1 bg-gray-600 p-10 opacity-80">

                <CanvasBoard
                    ref={drawingCanvas}
                    // canvasList={canvasList}
                    // curEditId={curEditId}
                    canvasHeight={canvasHeight}
                    canvasWidth={canvasWidth}
                    curCanvas={canvasList.find(c => c.id === curEditId)}
                />
                <div className="ribbon flex flex-row justify-around mt-2">
                    <div className="set-canvas-ratio">
                        <Select
                            id="ratio-select"
                            onChange={changeHWRatio}
                            defaultValue="9:16"
                            aria-label="name is"
                            style={{ backgroundColor: "rgb(11,11,11)" }}
                        >
                            <Option value="9-16">9:16</Option>
                            <Option value="1-1">1:1</Option>
                            <Option value="3-4">3:4</Option>
                        </Select>
                    </div>

                    <div
                        className=" text-pink-800 font-semibold cursor-pointer bg-yellow-300 w-max px-2 rounded-3xl "
                        onClick={composite}>
                        composite
                    </div>
                </div>


            </div>
            <div className="option-part flex-1 bg-gray-600 opacity-80 border-l-2 border-gray-50">
                <Palette canvasList={canvasList} curEditId={curEditId} />

            </div>
            <ResultDialog
                visible={visible}
                content={renderRusltContent()}
                onClose={() => {
                    setVisible(false)
                }}
                onDownload={() => {
                    const a = document.createElement('a');
                    document.body.appendChild(a)
                    a.style.display = 'none'
                    a.href = result;
                    a.download = `drawVideo${new Date().toLocaleString()}.mp4`;
                    a.click();
                    document.body.removeChild(a)
                }}
                title="Here is your video!"
            />


        </div>
    )
}
