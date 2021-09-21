
import React from 'react'

export default function ResultDialog({ content = null, title = "Dramalf UI title", visible = false, onClose = () => { }, onDownload = () => { } }) {
    return (
        <div style={{ visibility: visible ? "visible" : "hidden", minHeight: "100px", top: "15%" }} className="result-wrapper overflow-auto z-10 fixed p-2 bg-gray-500 rounded-md left-0 right-0 m-auto w-max text-gray-100 shadow-2xl">

            <div className="dialog-header flex justify-between items-center mb-1">
                <div className="dialog-title">{title}</div>
                <div className="close-result rounded-full float-right mr-1 bg-red-600 text-sm w-4 h-4 leading-4 cursor-pointer " onClick={onClose}>×</div>
            </div>
            <div className="dialog-content border-2 border-gray-200">
                {
                    content
                }
            </div>
            <div className="dialog-bottom flex justify-around mt-2 text-xs">
                <div></div>
                <div></div>
                <div className="download-result cursor-pointer p-1 bg-yellow-200 rounded-md font-bold text-gray-600 font-mono" onClick={onDownload}>download</div>
            </div>
        </div>
    )
}
