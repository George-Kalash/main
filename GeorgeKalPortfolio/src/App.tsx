import { useState } from 'react'
import Header from "./components/header"
import Cursor from "./components/cursor"
import WelcomeAnimation from "./components/WelcomeAnimation"
import Button from './components/button'
import RollingText from './components/rollingText'
import HeroPreview from "./components/HeroPreview";
import GiantResumeSection from './components/GiantResumeSection'
import BgGradient from './components/BgGradient'

// import { changeCursor } from './components/button'

export default function App() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className='cursor-none ' >
      {/* Fixed background sits behind all content and uses background-attachment:fixed
          to avoid moving with scroll or transforms in other layers. */}
      
      <Cursor />
      {/* <WelcomeAnimation onFinish={() => setShowWelcome(false)} /> */}
      <BgGradient />
      <HeroPreview
        symbols={["AAPL","MSFT","NVDA","GOOG", "SHOP","AMZN","META", "NFLX", "WMT", ]}
        resumeHref="/resume.pdf"
      />         
      <GiantResumeSection></GiantResumeSection>
    </div>
  )
}
