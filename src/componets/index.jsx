import React, { useRef, useState, useEffect } from 'react'
import CanvasBoard from './drawingBoard'
import CanvasSlider from './canvasSlider'
import Palette from './palette'
import ResultDialog from './resultDialog'
import ee from './event'
// import { createFFmpeg } from '@ffmpeg/ffmpeg'
import { nanoid } from 'nanoid'
const initCanvasList = [
    {
        id: 'c1',
        ctx: null,
        duration: 5
    },
]

export default function Demo() {
    useEffect(() => {
        async function fetchFFmpeg() {
            const { createFFmpeg } = window.FFmpeg
            const ffmpeg = createFFmpeg({
                //corePath: "../../node_modules/@ffmpeg/core/dist/ffmpeg-core.js",
                log: true,
            });
            await ffmpeg.load()
            window.ffmpeg = ffmpeg
            return ffmpeg
        }
        fetchFFmpeg()
    }, [])
    useEffect(() => {
        window.cl = canvasList
        window.dc = drawingCanvas.current
    });
    useEffect(() => {
        ee.addListener("ADDNEWCANVAS", addNewCanvas)
        ee.addListener("FINISHDRAW", updateCtx)
        ee.addListener("SWICTHCUREDIT", switchCanvas)
        return () => {
            ee.removeListener("ADDNEWCANVAS", addNewCanvas)
            ee.removeListener("FINISHDRAW", updateCtx)
            ee.removeListener("SWICTHCUREDIT", switchCanvas)
        }
    });
    const [visible, setVisible] = useState(false)
    const [result, setResult] = useState()
    const addNewCanvas = (sn) => {
        let tempList = canvasList
        tempList.splice(sn, 0, {
            id: nanoid(3),
            ctx: null,
            duration: 5
        })
        setCanvasList([...tempList])
    }
    const updateCtx = (ctx) => {
        let tempList = canvasList
        tempList.some(c => {
            if (c.id === curEditId) {
                c.ctx = ctx
                return true
            }
        })
        setCanvasList([...tempList])
    }
    const switchCanvas = (e) => {
        setCurEditId(e)
    }
    const composite = async () => {
        const ffmpeg = window.ffmpeg
        const { fetchFile } = window.FFmpeg
        const pageData = getPageData()
        const fileList = pageData.map(page => {
            const { id } = page
            return `file ${id}.mp4`
        })
        ffmpeg.FS('writeFile', 'concat.txt', fileList.join('\n'))
        const img = document.createElement('img')
        img.width = 225;
        img.height = 400;
        await (async function () {
            for (let i = 0; i < pageData.length; i++) {
                async function compositePart() {
                    const { duration, base64, id } = pageData[i]
                    img.src = base64;
                    ffmpeg.FS('writeFile', `${id}.png`, await fetchFile(img.src))
                    await ffmpeg.run('-r', '15', '-f', 'image2', '-loop', '1', '-i', `${id}.png`, '-s', '224x400', '-pix_fmt', 'yuvj420p', '-t', `${duration}`, '-vcodec', 'libx264', `${id}.mp4`)
                }
                await compositePart()
            }
        })()

        await ffmpeg.run('-f', 'concat', '-i', 'concat.txt', '-c', 'copy', 'result.mp4')
        const data = await ffmpeg.FS('readFile', 'result.mp4')
        // const video = document.createElement("video")
        const video = document.getElementById("result-video")
        //video.setAttribute('id', "result-video");
        video.height = 400;
        video.width = 224;
        video.controls = true;
        video.autoplay = true;
        video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        setVisible(true)
        setResult(video.src)
    }
    const renderRusltContent = () => {
        return (<div>
            <video id="result-video"></video>
        </div>)
    }
    const getPageData = () => {
        const canvasPages = canvasList.map(page => {
            return {
                id: page.id,
                duration: page.duration,
                base64: page.ctx.canvas.toDataURL("image/png")
            }
        })
        return canvasPages
    }
    const [canvasList, setCanvasList] = useState(initCanvasList);
    const drawingCanvas = useRef(null)
    const [curEditId, setCurEditId] = useState('c1');
    return (
        <div className="flex flex-row justify-between">
            <div className="slider-part w-32 border-2 border-gray-400 mr-4 rounded-lg" style={{ height: "80vh" }}>
                <CanvasSlider canvasList={canvasList} curEditId={curEditId} />
            </div>
            <div className="cb-part flex-1 rounded-l-lg">
                <div style={{ height: "80vh" }} className="bg-yellow-100 p-10 opacity-80">
                    <CanvasBoard ref={drawingCanvas} canvasList={canvasList} curEditId={curEditId} /></div>


            </div>
            <div className="option-part bg-yellow-100 opacity-80">
                <Palette canvasList={canvasList} curEditId={curEditId} />
                <div onClick={composite}>
                    composite
                </div>
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
                    console.log(result)
                }}
                title="Here is your video!"
            />


        </div>
    )
}
