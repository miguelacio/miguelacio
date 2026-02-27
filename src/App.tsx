import { useEffect, useRef } from 'react'

import './App.css'


let defaultValues = {
  topText: `neon`,
  midText: `genesis`,
  botText: `evangelion`,
  epText: `EPISODE:12`,
  titleText:
    `She said,"Don't make others suffer
for your personal hatred."`,
};

const config = {
  canvasWidth: 900,
  canvasHeight: 675,
  leftMargin: 75,
  rightBoundary: 815,
  smHeadSize: 675 * 0.184,
  lgHeadSize: 675 * 0.308,
  epSize: 675 * 0.095,
  titleSize: 675 * 0.095,
  maxWidth: 815 - 75,
  topSquash: 0.62,
  midSquash: 0.62,
  botSquash: 0.57,
  epSquash: 0.76,
  titleSquash: 0.76

}


  const addFittedText = (ctx: CanvasRenderingContext2D, config: any, text: string, y: number, squash = 1, align = 'left', maxWidth = 740) => {
    let x: number;
    if (align == "right") {
      ctx.textAlign = "right";
      x = config.rightBoundary;
    }
    else if (align == "left") {
      ctx.textAlign = "left";
      x = config.leftMargin
    }
    else if (align == "center") {
      ctx.textAlign = "center";
      x = (config.rightBoundary + config.leftMargin) / 2;
    }
    else { x = parseFloat(align) }

    let toDraw = text.split('\n');

    if (toDraw.length > 1) {
      ctx.textBaseline = "middle";
    }
    for (let i = 0; i < toDraw.length; i++) {
      let mWidth = ctx.measureText('M').width;

      let widthCalc = ctx.measureText(toDraw[i]).width;
      if (widthCalc * squash >= maxWidth) {
        widthCalc = maxWidth;
      } else {
        widthCalc = widthCalc * squash;
      }

      ctx.fillText(toDraw[i], x, y + (i * mWidth), widthCalc);
    }

    // reset to "reasonable" defaults
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
  }

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
 
  useEffect(() => {
    // Trigger the form submit programmatically
    const form = document.getElementById("autoSubmitForm") as HTMLFormElement;
    if (form) {
      form.requestSubmit();  // This triggers the form's onSubmit handler
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const formJson = Object.fromEntries(formData.entries());

    const topText = formJson.topText.toString().toUpperCase() as string;
    const midText = formJson.midText.toString().toUpperCase() as string;
    const botText = formJson.botText.toString().toUpperCase() as string;
    const epText = formJson.epText.toString().toUpperCase() as string;
    const titleText = formJson.titleText.toString().toUpperCase() as string;

    const { topSquash, midSquash, botSquash, epSquash, titleSquash, lgHeadSize, smHeadSize, epSize, titleSize, canvasHeight, canvasWidth } = config;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    // Clear the canvas

    let addText = addFittedText.bind(null, ctx, config);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;


    // Set background color
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#FFFFFF";
    ctx.textBaseline = "top";
    ctx.textAlign = 'left';

    ctx.font = `900 ${smHeadSize}px Times New Roman`;


    // Draw the text on the canvas
    addText(topText, 50, topSquash);
    addText(midText, 150, midSquash);

    ctx.font = `900 ${lgHeadSize}px Times New Roman`;
    addText(botText, 239, botSquash);

    ctx.font = `700 ${epSize}px Helvetica Neue,Helvetica,sans-serif`;
    addText(epText, 430, epSquash);

    ctx.font = `600 ${titleSize}px Times New Roman, serif`;
    addText(titleText, 530, titleSquash, 'left');
  }



  return (
    <div className="w-full h-full">
      <div className="md:flex justify-center min-h-screen  text-white ">
        <div className="bg-gray-900 p-8 rounded-xl shadow-xl ">

          <h1 className="text-2xl font-bold mb-6 text-center">Neon Genesis Evangelion Title Card Generator</h1>

          <form id="autoSubmitForm" onSubmit={handleSubmit} className="space-y-6">

            <label className="block text-lg font-semibold mb-2" htmlFor="topText">First Line</label>
            <input className='w-full p-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none' name="topText" type="text" defaultValue={defaultValues.topText} />

            <label className="block text-lg font-semibold mb-2" htmlFor="midText">Second Line</label>
            <input className='w-full p-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none' name="midText" type="text" defaultValue={defaultValues.midText} />

            <label className="block text-lg font-semibold mb-2" htmlFor="botText">Third Line</label>
            <input className='w-full p-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none' name="botText" type="text" defaultValue={defaultValues.botText} />

            <label className="block text-lg font-semibold mb-2" htmlFor="epText">"EPISODE"</label>
            <input className='w-full p-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none' name="epText" type="text" defaultValue={defaultValues.epText} />

            <label className="block text-lg font-semibold mb-2" htmlFor="titleText">Title Line</label>
            <textarea className='h-32 w-full p-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none' name="titleText"  defaultValue={defaultValues.titleText} />

            <button id="generate" type='submit' className='text-white bg-brand box-border border border-transparent font-medium leading-5 rounded-base text-sm px-4 py-2.5' >Generate!</button>
          </form>

        </div>
          <canvas className="p-2" id="canvas" ref={canvasRef} width={config.canvasWidth} height={config.canvasHeight} />
      </div>
    </div>
  )
}

export default App
