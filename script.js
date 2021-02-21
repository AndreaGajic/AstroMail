function loadImage(url) {
    return new  Promise(resolve => {
        const image = new Image();  
        //image.crossOrigin = "Anonymous";
        image.setAttribute('crossOrigin', 'anonymous');      
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url; 
    });
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

//copied from http://jsfiddle.net/eECar/16/
//wraps words while writing to canvas
function writeWrappedText(ctx, text, fontSize, fontColor, xoffset, yoffset, max_width) {
    var lines      =  new Array();
    var width = 0, i, j;
    var result;
    var color = fontColor || "white";

    // Font and size is required for ctx.measureText()
    ctx.font   = fontSize + "px Times New Roman";

    
    // Start calculation
    while ( text.length ) {
    	for( i=text.length; ctx.measureText(text.substr(0,i)).width > max_width; i-- );
    
    	result = text.substr(0,i);
    
    	if ( i !== text.length )
    		for( j=0; result.indexOf(" ",j) !== -1; j=result.indexOf(" ",j)+1 );
    	
    	lines.push( result.substr(0, j|| result.length) );
    	width = Math.max( width, ctx.measureText(lines[ lines.length-1 ]).width );
    	text  = text.substr( lines[ lines.length-1 ].length, text.length );
    }
    
    ctx.font   = fontSize + "px Times New Roman";;

    // Render
    ctx.fillStyle = color;
    for ( i=0, j=lines.length; i<j; ++i ) {
    	ctx.fillText(lines[i],xoffset,yoffset + 1.5*fontSize*i);
    }
}


//function draws card
var drawCard=function(year,month,day)
{
  //this selects the div node with id "drawing"
  var drawing=document.getElementById("drawing");
  //empty any children (existing cards)
  removeAllChildNodes(drawing);

  //now create new canvas (to put into drawing)
  var canvas = document.createElement("canvas");
  //put that canvas as a child element into drawing
  document.getElementById("drawing").appendChild(canvas);

  // set desired size of transparent image
  canvas.width = 800;
  canvas.height = 550;

  var ctx = canvas.getContext("2d");
  //white background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //call NASA api
  var nasaAPI="https://api.nasa.gov/planetary/apod?api_key=GVm095woAyDJac1SVkavcN2JtJuzjWkmD1GoZGDK&date="+year+"-"+month+"-"+day;
  fetch(nasaAPI).then(response => response.json())
  .then(function(data){
    //after we call API we print the data to the console
    console.log(data);
    //url to the picture of the day
    console.log(data.url);
    var imageWidth=300;
    var imageHeight=300;
    //now we put this in canvas
    //I used code by https://gist.github.com/Veejay/8497487 so that the image is served with the correct CORS header
    loadImage("https://www.michellemobius.org/bounce/images?url="+data.url).then(image=>{
        ctx.drawImage(image,canvas.width/2-imageWidth/2,canvas.height/2-imageHeight/2-20,imageWidth,imageHeight);  // the function LoadImage returns a Promise with image object
        //now write explanation as text
        writeWrappedText(ctx,data.explanation,12,"white",0.1*canvas.width,canvas.height/2+imageHeight/2+10,0.8*canvas.width);

        writeWrappedText(ctx,"NASA Photo of the day on "+year+"-"+month+"-"+day,20,"white",0.35*canvas.width,50,0.8*canvas.width);
        //now write custom message
        writeWrappedText(ctx,document.getElementById("message").value,20,"white",600,0.5*canvas.height-0.5*imageHeight+50,0.15*canvas.width);
        //write to and from on other side
        writeWrappedText(ctx,"To: "+document.getElementById("messageTo").value,20,"white",100,0.5*canvas.height-0.5*imageHeight+50,0.15*canvas.width);
        writeWrappedText(ctx,"From: "+document.getElementById("messageFrom").value,20,"white",100,0.5*canvas.height-0.5*imageHeight+100,0.15*canvas.width);



        //ctx.font = "10px Arial";
        //ctx.fillStyle="white";
        //ctx.fillText(data.explanation,);
        // extract as new image (data-uri)
        var url = canvas.toDataURL();
        //assign image to download link
        var link=document.getElementById("card");
        link.href=url;
        link.download = 'card.png';
    });  
  });
}

var redrawCard=function(){
  var year=document.getElementById("year").value;
  var month=document.getElementById("month").value;
  var day=document.getElementById("day").value;
  drawCard(year,month,day);
}

//prepopulate input text fields with today's date
var today = new Date();
var day=today.getDate();
var month=today.getMonth()+1;
var year=today.getFullYear();
document.getElementById("year").value=year;
document.getElementById("month").value=month;
document.getElementById("day").value=day;

drawCard(year,month,day)
