$( document ).ready(
    function()
    {
        const canvas = $( "#drawtool-canvas" );
        const ctx = canvas[0].getContext("2d");

        //
        // handlers
        // 

        // select tool
        $( ".tool" ).on("click", function ()
        {
            $(".drawtool-options .drawtool-active")?.removeClass("drawtool-active");
            
            $(this).addClass("drawtool-active");
            
            drawtool_helper.selectedTool = $(this).attr("id");
        });

        // select color
        $( ".drawtool-colors .drawtool-option" ).on("click", function ()
        {
            $(".drawtool-options .selected").removeClass("selected");
            
            $(this).addClass("selected");
            
            drawtool_helper.selectedColor = $(this).css("background-color");
        });

        // select custom color
        $( "#drawtool-color-picker" ).on("change", function ()
        {
            $(this).parent().css("background-color", $(this).prop("value"));
            $(this).parent().trigger("click");
        });

        // select fill color
        $( "#fill-color" ).on("change", function ()
        {
            drawtool_helper.fillColor = $(this).prop("checked");   
        })

        // select brush size
        $( "#size-slider" ).on("change", function ()
        {
            drawtool_helper.brushWidth = $(this).prop("value");
        });

        // clear canvas
        $(" .drawtool-clear-canvas ").on("click", function ()
        {
            if(confirm("Limpar o quadro?")) ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
        });

        // save img
        $(" .drawtool-save-img ").on("click", function ()
        {
            const link = document.createElement("a");
            link.download = prompt("Nome para a picture:") + '.png';

            if (link.download.startsWith('null')) return;

            link.href = canvas[0].toDataURL();

            link.click();
        });

        // drawConfigs
        canvas.on("mouseout", () => { drawtool_helper.isDrawing = false; });
        canvas.on("mouseup", () => { drawtool_helper.isDrawing = false; });
        canvas.on("mousedown", (e) => {drawtool_helper.drawConfigs.startDraw(canvas[0], ctx, e)});
        canvas.on("mousemove", (e) => {drawtool_helper.drawConfigs[drawtool_helper.selectedTool].doDraw(ctx, e)});

        // 
        // auto triggers
        // 
    }
)
