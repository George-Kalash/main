import { useState } from 'react'
import Header from "./components/header"
import Cursor from "./components/cursor"
import WelcomeAnimation from "./components/WelcomeAnimation"
import Button from './components/button'
import RollingText from './components/rollingText'

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
          <Header />
          <RollingText />
         
        </>
        

      )}
    </div>
  )
}
