const defaultBackgroundColor = "#deeaf2";

$( document ).ready(
    function() 
    {
        const contentControlButtons = $(".component-icon-container .component-icon");
        
        for(let controlButton of contentControlButtons)
        {
            buildComponent(controlButton.id, controlButton.dataset.contentimg, controlButton.dataset.contentid);
        }
        
        //
        // handlers
        //
        
        $( "#open-in-tab-input" ).on("click", function (event) { open("../index.html"); });

        $( "#choose-color-input" ).on("change", function (event) {
            $( ".component-container" ).css("background-color", event.target.value);
            $( "#choose-color-input" ).css("background-color", event.target.value);

            localStorage.setItem("theme-color", event.target.value);
        });

        //
        // auto triggers
        //

        setDefaultBackgroundColor();
    }
);

function buildComponent(key, icon, content)
{
    $( ("#"+key) ).prepend(
        $("<button>", {class: 'button-component-icon'})
        .on("click", function () {
            $('.button-component-icon').removeClass('button-component-icon-active');
            $(this).addClass('button-component-icon-active');

            $('.component-content').addClass('hidden');
            $( ("#"+content) ).removeClass('hidden');
        })
        .prepend(
            $("<img>", {src: ('pictures/'+icon), style: 'width: 30px; height: 30px; vertical-align: middle;'})
        )
    );
}

function setDefaultBackgroundColor()
{
    if (!localStorage.getItem("theme-color")) 
    {
        localStorage.setItem("theme-color", defaultBackgroundColor);
    }

    $( "#choose-color-input" ).attr("value", localStorage.getItem("theme-color"));
    $( "#choose-color-input" ).trigger("change");
}
