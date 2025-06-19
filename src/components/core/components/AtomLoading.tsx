import React, { FC } from 'react'

interface AtomProps {
  animationDuration?: string | number
  size?: number
  color?: string
}

const Atom: FC<AtomProps> = ({
  animationDuration = 1000,
  size = 60,
  color = '#fff',
}) => {
  const spinnerStyle: React.CSSProperties = {
    height: `${size}px`,
    width: `${size}px`,
  }

  const circleStyle: React.CSSProperties = {
    color: color,
    fontSize: `${size * 0.24}px`,
  }

  const lineStyle: React.CSSProperties = {
    animationDuration: `${animationDuration}ms`,
    borderLeftWidth: `${size / 25}px`,
    borderTopWidth: `${size / 25}px`,
    borderLeftColor: color,
  }

  return (
    <div className="atom-spinner" style={spinnerStyle}>
      <div className="spinner-inner">
        <div className="spinner-line" style={lineStyle} />
        <div className="spinner-line" style={lineStyle} />
        <div className="spinner-line" style={lineStyle} />
        <div className="spinner-circle" style={circleStyle}>
          <img src="/favicon.ico" alt="logo" />
        </div>
      </div>
    </div>
  )
}

export default Atom
