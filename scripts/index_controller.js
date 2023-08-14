$( document ).ready(
    function() 
    {
        if (!localStorage.getItem("theme-color")) {localStorage.setItem("theme-color", "#deeaf2");}
        $( "#choose-color-input" ).attr("value", localStorage.getItem("theme-color"));

        const contentByIcon = (
            {
                "notes-component": [
                    "notes.png",
                    "notes-content"
                ],
                "copies-component": [
                    "copies.png",
                    "copies-content"
                ],
                "duplicates-component": [
                    "duplicates.png",
                    "duplicates-content"
                ],
                "csvs-component": [
                    "csvs.png",
                    "csvs-content"
                ]
            }
        );

        for(let key of Object.keys(contentByIcon))
        {
            buildComponent(key, contentByIcon[key][0], contentByIcon[key][1]);
        }

        //
        // handlers
        //
        
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
            $("<img>", {src: ('pictures/'+icon), style: 'width: 30px; height: 30px'})
        )
    );
}
