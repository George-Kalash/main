import { useState } from 'react'
import Header from "./components/header"
import Cursor from "./components/cursor"
import WelcomeAnimation from "./components/WelcomeAnimation"
import Button from './components/button'
import RollingText from './components/rollingText'
import HeroPreview from "./components/HeroPreview";
import GiantResumeSection from './components/GiantResumeSection'

// import { changeCursor } from './components/button'

export default function App() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className='cursor-none h-screen' >
      <div className="fixed w-screen h-screen z-0 top-0 left-0" style={{ // <- fix this make this separate tags for each radii
        background:
          "radial-gradient(1200px 500px at 50% -10%, rgba(99,102,241,0.25), transparent)," +
          "radial-gradient(800px 400px at 80% 20%, rgba(16,185,129,0.25), transparent)," +
          "radial-gradient(600px 300px at 20% 30%, rgba(56,189,248,0.2), transparent)",
      }}>
        
      </div>
      <Cursor />
      <WelcomeAnimation onFinish={() => setShowWelcome(false)} />
      <HeroPreview
        symbols={["AAPL","MSFT","NVDA","GOOGL", "SHOP","AMZN","META", "NFLX", "WMT", ]}
        resumeHref="/resume.pdf"
      />         
      <GiantResumeSection></GiantResumeSection>
    </div>
  )
}
