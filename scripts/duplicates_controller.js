$( document ).ready(
    function ()
    {
        //
        // handlers
        //

        $( ".duplicates-control-button" ).on("click",
            function ()
            {
                $(".duplicates-control-button").removeClass("duplicates-control-button-active");
                $(this).addClass("duplicates-control-button-active");

                $(".duplicates-section").addClass("hidden");
                $( ("#"+this.dataset.contentid) ).removeClass("hidden");
            }
        );
        $( "#duplicates-input-ok" ).on("click", duplicates_helper.duplicatesInputOkHandler);

        //
        // auto triggers
        //

        $( "#duplicates-input-btn" ).trigger("click");
    }
)