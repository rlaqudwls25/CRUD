import React from 'react'
import { Oval } from 'react-loader-spinner'
// import './Loading.scss'

const Loading = () => {
  return (
    <div className="loading-box">
      <Oval height={40} width={40} />
    </div>
  )
}

export default Loading
