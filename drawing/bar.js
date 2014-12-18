//copied from score. Does not display if item selected. Also gets a relative value, due to bar height change.
var drawThumbnailItem = function(canvas, context, x, y, item, lineHeight, standardLineHeight){
	if(item.type == "note" || item.type == undefined || item.type == null){
		
		//get relative value
		var relativeValue = item.value * lineHeight / standardLineHeight;
		
		//draw the note
		context.beginPath();
		context.fillStyle = noteColour;
		context.arc(x, y + relativeValue, lineHeight / 8, 0, 2 * Math.PI, false);
		
		if(item.duration && item.duration.denom == 1 && item.duration.num > 2){
			context.lineWidth = 2;
			context.strokeStyle = noteColour;
			context.stroke();
			context.lineWidth = 1;
		}
		else{
			if(item.duration && item.duration.denom == 1 && item.duration.num == 2){
				context.lineWidth = 2;
				context.strokeStyle = noteColour;
				context.stroke();
				context.lineWidth = 1;
			}
			else{
				context.fill();
			}
			
			//draw the stem
			context.beginPath();
			context.strokeStyle = noteColour;
			if(relativeValue >= lineHeight/2){
				context.moveTo(x + 5.5, y + relativeValue);
				context.lineTo(x + 5.5, y + relativeValue - 36);
				context.strokeStyle = noteColour;
				context.stroke();
				
				if(item.duration && item.duration.num == 1 && item.duration.denom > 1){
					var tailX = x + 5.5;
					var tailY = y + relativeValue - 36;
					var tailController = item.duration.denom;
					var tailNum = 0;
					while(tailController > 1){
						context.beginPath();
						context.moveTo(tailX, tailY);
						context.bezierCurveTo(tailX + 1, tailY + 10, tailX + 15, tailY + 13, tailX + 7, tailY + 25);
						context.bezierCurveTo(tailX + 13, tailY + 13, tailX, tailY + 8, tailX,  tailY + 15);
						context.lineTo(tailX, tailY);
						context.fill();
						context.strokeStyle = noteColour;
						context.stroke();
						tailController = Math.floor(tailController / 2);
						if(tailNum == 0){tailY += 10;}
						else if(tailNum == 1){tailY -= 20;}
						else{tailY -= 10;}
						tailNum++;
					}
				}
			}else{
				context.moveTo(x - 5.5, y + relativeValue);
				context.lineTo(x - 5.5, y + relativeValue + 36);
				context.strokeStyle = noteColour;
				context.stroke();
				
				if(item.duration && item.duration.num == 1 && item.duration.denom > 1){
					var tailX = x - 5.5;
					var tailY = y + relativeValue + 36;
					var tailController = item.duration.denom;
					var tailNum = 0;
					while(tailController > 1){
						context.beginPath();
						context.moveTo(tailX, tailY);
						context.bezierCurveTo(tailX + 1, tailY - 10, tailX + 15, tailY - 13, tailX + 7, tailY - 25);
						context.bezierCurveTo(tailX + 13, tailY - 13, tailX, tailY - 8, tailX,  tailY - 15);
						context.lineTo(tailX, tailY);
						context.fill();
						context.strokeStyle = noteColour;
						context.stroke();
						tailController = Math.floor(tailController / 2);
						if(tailNum == 0){tailY -= 10;}
						else if(tailNum == 1){tailY += 20;}
						else{tailY += 10;}
						tailNum++;
					}
				}
			}
		}
	}
	else if(item.type == "rest"){
		
	}
	else if(item.type == "clef"){
		
	}
}

var drawSingleBar = function(canvas, context, x, y, bar, width, height, standardLineHeight){
	context.beginPath();
	var startX = x;
	var finalX = x + width;
	var startY = y;
	
	var tempY = startY;
	
	for(var j = 0; j < 5; j++){
		context.beginPath();
		context.moveTo(x, tempY);
		context.lineTo(finalX, tempY);
		context.strokeStyle = staveColour;
		context.stroke();
		tempY += height / 4;
	}
	
	context.fillStyle = noteColour;
	context.font = "bold " + (2 * height/3) + "px Arial";
	context.fillText(bar.timeSignature.top, x, y + height/2);
	context.fillText(bar.timeSignature.bottom, x, y + height);
	
	var itemX = x + 40;
	
	for(var i = 0; i < bar.items.length; i++){
		if(bar.items[i].type == "note" || bar.items[i].type == undefined || bar.items[i].type == null){
			drawThumbnailItem(canvas, context, itemX, y, bar.items[i], height, standardLineHeight);
			itemX += 20;
			if(itemX >= x + width - 10){
				break;
			}
		}
	}
}
