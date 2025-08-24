import { useState } from 'react'
import Header from "./components/header"
import Cursor from "./components/cursor"
import WelcomeAnimation from "./components/WelcomeAnimation"
import Button from './components/button'
import RollingText from './components/rollingText'
import HeroPreview from "./components/HeroPreview";

// import { changeCursor } from './components/button'

export default function App() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className='cursor-none h-screen'>
      <Cursor />

      {showWelcome ? (
        <WelcomeAnimation onFinish={() => setShowWelcome(false)} />
      ) : (
        <>
          {/* <Header /> */}
          {/* <RollingText /> */}
          <HeroPreview
            apiKey="72b6201928424072a94dc8050afcc523"   // or put in .env as VITE_TWELVE_API_KEY
            symbols={["AAPL","MSFT","NVDA","GOOGL","AMZN","META","TSLA"]}
            resumeHref="/resume.pdf"
          />
         
        </>
        


      )}
    </div>
  )
}
