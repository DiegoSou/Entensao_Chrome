$( document ).ready(
    function() 
    {
        if (!localStorage.getItem("theme-color")) {localStorage.setItem("theme-color", "#deeaf2");}
        $( "#choose-color-input" ).attr("value", localStorage.getItem("theme-color"));

        const contentControlButtons = $( ".component-icon-container .component-icon" );

        for(let controlButton of contentControlButtons)
        {
            buildComponent(
                controlButton.id, // div id
                controlButton.dataset.contentimg, // content image
                controlButton.dataset.contentid // content id
            );
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

        $( "#choose-color-input" ).trigger("change");
    }
);

function buildComponent(key, icon, content)
{
    $( ("#"+key) ).prepend(
        $("<button>", {class: 'button-component-icon'})
        .click(
            function() 
            {
                $('.button-component-icon').removeClass('button-component-icon-active');
                $(this).addClass('button-component-icon-active');

                $('.component-content').addClass('hidden');
                $( ("#"+content) ).removeClass('hidden');
            }
        )
        .prepend(
            $("<img>", {src: ('pictures/'+icon), style: 'width: 30px; height: 30px; vertical-align: middle;'})
        )
    );
}
