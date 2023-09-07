let drawtool_helper = {};

$( document ).ready(function ()
{
    drawtool_helper = {

        snapshot : undefined,
        prevMouseX : undefined,
        prevMouseY : undefined, 
        isDrawing : false,
        fillColor : false,
        selectedTool : 'brush',
        brushWidth : 5,
        selectedColor : "#000",

        // drawConfigs
        drawConfigs : (
            {
                stopDraw : function () { drawtool_helper.isDrawing = false; },
                startDraw : function (canvas, ctx, event) 
                {
                    drawtool_helper.isDrawing = true;
                    drawtool_helper.prevMouseX = event.offsetX;
                    drawtool_helper.prevMouseY = event.offsetY;
    
                    ctx.beginPath();
                    ctx.lineWidth = drawtool_helper.brushWidth;
                    ctx.strokeStyle = drawtool_helper.selectedColor;
                    ctx.fillStyle = drawtool_helper.selectedColor;
    
                    drawtool_helper.snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
                },
                'line' : (
                    {   
                        doDraw : function (ctx, event) 
                        {
                            if (drawtool_helper.isDrawing === false) return;

                            ctx.putImageData(drawtool_helper.snapshot, 0, 0);
    
                            ctx.beginPath();
    
                            ctx.moveTo(drawtool_helper.prevMouseX, drawtool_helper.prevMouseY);
                            ctx.lineTo(event.offsetX, event.offsetY);
                            ctx.stroke();
                        },
                    }
                ),
                'brush' : (
                    {
                        doDraw : function (ctx, event) 
                        {
                            if (drawtool_helper.isDrawing === false) return;

                            ctx.lineTo(event.offsetX, event.offsetY); 
                            ctx.stroke();
                        },
                    }
                ),
                'rectangle' : (
                    {
                        doDraw : function (ctx, event) 
                        {
                            if (drawtool_helper.isDrawing === false) return;

                            ctx.putImageData(drawtool_helper.snapshot, 0, 0);
                            
                            if (drawtool_helper.fillColor) ctx.fillRect(event.offsetX, event.offsetY, drawtool_helper.prevMouseX - event.offsetX, drawtool_helper.prevMouseY - event.offsetY);
                            else ctx.strokeRect(event.offsetX, event.offsetY, drawtool_helper.prevMouseX - event.offsetX, drawtool_helper.prevMouseY - event.offsetY);
                        },
                    }
                ),
                'circle' : (
                    {
                        doDraw : function (ctx, event)
                        {
                            if (drawtool_helper.isDrawing === false) return;

                            ctx.putImageData(drawtool_helper.snapshot, 0, 0);
                            
                            ctx.beginPath();
    
                            let radius = Math.sqrt(Math.pow((drawtool_helper.prevMouseX - event.offsetX), 2) + Math.pow((drawtool_helper.prevMouseY - event.offsetY), 2));
                            ctx.arc(drawtool_helper.prevMouseX, drawtool_helper.prevMouseY, radius, 0, 2 * Math.PI);
                            
                            if (drawtool_helper.fillColor) ctx.fill();
                            else ctx.stroke();
                        }  
                    }
                ),
                'triangle' : (
                    {
                        doDraw : function (ctx, event)
                        {
                            if (drawtool_helper.isDrawing === false) return;
                            
                            ctx.putImageData(drawtool_helper.snapshot, 0, 0);
    
                            ctx.beginPath();
    
                            ctx.moveTo(drawtool_helper.prevMouseX, drawtool_helper.prevMouseY);
                            ctx.lineTo(event.offsetX, event.offsetY);
                            ctx.lineTo(drawtool_helper.prevMouseX * 2 - event.offsetX, event.offsetY);
                            ctx.closePath();
                            
                            if (drawtool_helper.fillColor) ctx.fill();
                            else ctx.stroke();
                        }
                    }
                ),
                'eraser' : (
                    {
                        doDraw : function (ctx, event)
                        {
                            if (drawtool_helper.isDrawing === false) return;
                            
                            ctx.strokeStyle = "#fff";
    
                            ctx.lineTo(event.offsetX, event.offsetY); 
                            ctx.stroke();
                        }
                    }
                )
            }
        )
        // end drawConfigs

    }
});
