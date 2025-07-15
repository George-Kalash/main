import { useState } from 'react'
import Header from "./components/header"
import Cursor from "./components/cursor"
import WelcomeAnimation from "./components/WelcomeAnimation"
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
    </>
  )
}
