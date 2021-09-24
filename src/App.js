import Demo from './componets'
import React, { useState } from 'react'
import './App.css';
import Loading from '@alifd/next/lib/loading';
import '@alifd/next/lib/loading/style';
function App() {
  const [loadingFFmpeg, setloadingFFmpeg] = useState(false)
  const [compositing, setCompositing] = useState(false)
  return (
    <div className="App bg-gray-500 h-screen flex flex-col font-mono">
      <div className="header h-8 border-2 border-gray-600 bg-gray-300 text-left font-mono font-extrabold bg-gradient-to-r from-indigo-100 to-gray-600 pl-2">
        <span>Draw your Video!</span>
      </div>
      <div className="demo-box">
        <Loading visible={loadingFFmpeg} fullScreen tip={<text className="text-yellow-300">loading resource<br />wait a moment please </text>} />
        <Loading visible={compositing} fullScreen tip={<div style={{ borderRadius: "39% 61% 24% 76%/64% 60% 40% 36%" }} className="text-gray-800 p-5 shadow-2xl bg-gradient-to-bl  font-mono   from-red-200 to-purple-500   
        "><text>Compositing your paints to video<br />Wait a moment please </text></div>} />
        <Demo
          loadedFFmpeg={() => {
            setloadingFFmpeg(false)
          }}
          beginComposite={() => {
            setCompositing(true)
          }}
          finishComposite={() => {
            setCompositing(false)
          }}
        />
      </div>
      <div className=" mt-3 text-sm text-gray-300 border-t-2 m-auto px-40 border-gray-600">producted by Dramalf 2021 </div>
    </div>
  );
}

export default App;
