import Button from "./button";
import NameTag from "./nameTag";

export default function Header() {

  return (
    <>
      <header className="fixed flex top-0 left-0 right-0 z-50 justify-around">
          <div className="left-side">
            <NameTag />
          </div>
          <div className="right-side flex">
            <Button className="p-2.5 pt-0.5 pb-0.5 m-2">Home</Button>
            <Button className="p-2.5 pt-0.5 pb-0.5 m-2">Experience</Button>
            <Button className="p-2.5 pt-0.5 pb-0.5 m-2">Projects</Button>
            <Button className="p-2.5 pt-0.5 pb-0.5 m-2">Connect</Button>
            <div className="theme_change_icon"></div>
          </div>
      </header>
    </>
  )
}