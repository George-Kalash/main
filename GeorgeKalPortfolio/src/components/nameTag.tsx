import { useEffect } from "react";

export default function NameTag() {

  useEffect(() => {
    const nameElement = document.getElementById("name");
    if (nameElement) {
      nameElement.addEventListener("mouseenter", () => {
        nameElement.classList.remove("hover:text-red-700");
      }
      );
      nameElement.addEventListener("mouseleave", () => {
        nameElement.classList.remove("hover:text-red-700");
      }
      );
  }}, []);

  return (
    <div id="name" className="m-[10px] text-xl font-bold "
      onMouseEnter={() => {
        const nameElement = document.getElementById("name");
        if (nameElement) {
          // finish this
        }
      }}
      onMouseLeave={() => {
        const nameElement = document.getElementById("name");
        if (nameElement) {
          // finish this
        }
      }}
    >
      <span >George K</span>
    </div>
  );
}