import { useState } from 'react'
import Header from "./components/header"
import Cursor from "./components/cursor"
import WelcomeAnimation from "./components/WelcomeAnimation"
import Button from './components/button'
// import { changeCursor } from './components/button'

export default function App() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true);
  return (
    <>

      {showWelcome ? (
        <WelcomeAnimation onFinish={() => setShowWelcome(false)} />
      ) : (
        <Header />
      )}
      <div className="h-screen">
        
        <Cursor />
        {/* <Header /> */}
        <WelcomeAnimation />
      </div>
      <div className="absolute bottom-100 right-4">
        <Button onClick={() => console.log('clicked')}>
          Custom Cursor 🔹
        </Button>
      </div>
    </>
  )
}
