import Button from "./button";

export default function Header() {


  return (
    <>
      <header className="fixed flex top-0 left-0 right-0 z-50 justify-between">
          <div className="left-side">
            <div id="name" className="m-[10px] text-xl text-black font-bold hover:text-red-700 active:text-green-700">George K</div>
          </div>
          <div className="right-side flex">
            <nav>Home</nav>
            <nav>Experience</nav>
            <nav>Projects</nav>
            <nav>Connect</nav>
            <div className="theme_change_icon"></div>
          </div>
      </header>
    </>
  )
}