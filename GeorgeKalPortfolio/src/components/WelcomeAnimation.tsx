type Props = { onFinish: () => void };

function getTodaysDate(date = new Date()) {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  let currentDate = `${weekdays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  
  return currentDate;
}


export default function WelcomeAnimation({ onFinish }: Props){

  const date = getTodaysDate();

  return (
    
      <div 
        className="animate-fade-in-out z-[1000] w-full h-full bg-amber-950A"
        onAnimationEnd={onFinish}>
        <div className="text-black grid-cols-2 items-center absolute top-2/5 left-[calc(50%-100px)] mr-auto ml-auto inline">
          <div className="text-5xl font-bold">Welcome</div>
          <div className="text-center">{date}</div>
        </div>
      </div>

  );
}