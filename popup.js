const btn = document.querySelector(".change-color-btn");
const colorGrid = document.querySelector(".color-grid");
const colorVal = document.querySelector(".color-val");

btn.addEventListener("click", async () => {
  chrome.storage.sync.get("color", ({ color }) => {
    console.log("color:", color);
  });
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  console.log(tab);
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: pickColor,
  }, async(injectionResults)=>{
    const [data] = injectionResults;
    if(data.result)
    {
        const color=data.result.sRGBHex;
        colorGrid.style.backgroundColor = color;
        colorVal.innerText=color;
        // Automatically copy the color in the clipboard
        try{
            await navigator.clipboard.writeText(color);
        } catch(err){
            console.error(err);
        }
    }
    
  });
});


async function pickColor() {
    try{
        const eyeDropper= new EyeDropper();
        return await eyeDropper.open();
    }
    catch(err)
    {
        console.error(err);
    }
}