$( document ).ready(
    function ()
    {
        //
        // handlers
        //

        $( document ).on("paste", helper.notesPasteHandler);
        $( ".note-control-button" ).on("click", 
            function () 
            {
                $(".note-control-button").removeClass('note-control-button-active');
                $(this).addClass('note-control-button-active');

                $(".note-section").addClass('hidden');
                $( ("#"+this.dataset.contentid) ).removeClass('hidden');

                if (this.dataset.contentid == "history-notes-section")
                {
                    buildHistoryNotesSection();
                }
            }
        );

        $( "#new-note-attach-file" ).on("change", helper.changeFileNotesInputHandler);
        $( "#new-note-save" ).on("click", helper.newNoteSaveHandler);
        $( "#new-note-clear" ).on("click", helper.newNoteClearHandler);
        
        $( "#export-notes-btn" ).on("click", helper.generateExportFile);
        $( "#import-notes-btn" ).on("click", helper.importNoteFile);

        //
        // auto triggers
        //

        $( "#notes-component" ).children()[0].click();
        $( "#new-note-btn" ).trigger("click");
    }
);

function buildHistoryNotesSection()
{
    $( "#history-notes-article" ).empty();
    for (let i=1; i <= Number(localStorage.getItem('notes-count'))+1; i++)
    {
        let info = JSON.parse(localStorage.getItem('annotation'+i+'-info'));
        let file = localStorage.getItem('annotation'+i+'-file');

        if (!info || !file) continue;
        buildNoteCardItem(info.index, info.title, info.description, info.checked, file)
    }
}

function buildNoteCardItem(index, title, description, checked, fileBase64)
{
    if (fileBase64?.endsWith('data:')) { fileBase64 = ""; }

    $( "#history-notes-article" ).prepend(

        // card border & container
        $("<div>", {style: "display: flex; border: 1px solid rgba(36, 36, 36, 0.181); border-radius: 4px; padding: 2%; margin: 1%; justify-content: space-between;"})
        
        // attach image & info container
        .append(
            $("<div>", {style: "display: flex"})
            .append(
                $("<input>", {type: "image", alt: "", src: fileBase64, style: "max-width: 20%; max-height: 20%; margin: 5px; align-self: center;"})
                .on("click", function () {
                    window.open().document.write('<iframe src="' + fileBase64 + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
                })
            )
            .append(
                $("<div>", {style: "display: flex; flex-direction: column;"})
                .append(
                    $("<span>", {style: "font-size: 110%; font-family: monospace; padding: 0 2%;"})
                    .text(title)
                )
                .append(
                    $("<span>", {style: "font-size: 100%; font-family: monospace; padding: 2%;"})
                    .text(description)
                )
            )
        )

        // trash/check buttons container
        .append(
            $("<div>", {style: "display: flex;"})
            .append(
                $("<input>", {type: "image", alt: "trash", src: "../pictures/trash.png", style: "max-width: 18px; max-height: 18px; margin: 3px; align-self: flex-start;"})
                .on("click", function () {
                    localStorage.removeItem(index+'-info');
                    localStorage.removeItem(index+'-file');
                    localStorage.setItem("notes-count", Number(localStorage.getItem("notes-count"))-1);

                    if (confirm("Excluir anotação?"))
                    {
                        $(this).parent().parent().remove();
                    } 
                })
            )
            .append(
                $("<input>", {type: "image", alt: "check", src: "../pictures/check.png", style: "max-width: 20px; max-height: 20px; margin: 3px; align-self: flex-start;"})
                .on("click", function () {
                    checked = (checked ? false : true);
                    localStorage.setItem(index+'-info', JSON.stringify({index: index, title: title, description: description, checked: checked}));

                    $(this).parent().parent().css("text-decoration", checked ? "line-through" : "auto")
                })
            )
        )

        // container text decoration
        .css("text-decoration", checked ? "line-through" : "auto")
    );
}