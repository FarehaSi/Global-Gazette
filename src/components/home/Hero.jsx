import React from 'react'
import bg from '../../assets/img/bg.jpg'

const Hero = () => {
  const heroStyle = {
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    backdropFilter: "blur(8px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "5rem 1rem",
    border: "none", 
    position: "relative",
    color: "white"
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  };

  return (
    <section style={heroStyle}>
      <div style={overlayStyle}></div>
      <div className="content" style={{ position: 'relative', zIndex: 2 }}>
        <h1 className="display-3 mb-4" style={{ textShadow: '2px 2px 4px #000' }}>Welcome to the Global Gazette!</h1>
        <p className="lead mb-5" style={{ textShadow: '1px 1px 2px #000' }}>
          We're your source for global insights, stories, and diverse perspectives. Explore the world with us, one article at a time.
        </p>
      </div>
    </section>
  )
}

export default Hero
