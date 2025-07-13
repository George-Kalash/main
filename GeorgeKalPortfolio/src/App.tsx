import Header from "./components/header"
import Cursor from "./components/cursor"

export default function App() {
  return (
    <>
      <div className="cursor-none h-full">
        <Cursor />
        <Header />

      </div>
    </>
  )
}
