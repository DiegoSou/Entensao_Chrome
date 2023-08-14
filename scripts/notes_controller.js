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
    for (let i=1; i <= Number(localStorage.getItem('notes-count')); i++)
    {
        let info = JSON.parse(localStorage.getItem('annotation'+i+'-info'));
        let file = localStorage.getItem('annotation'+i+'-file');

        buildNoteCardItem(info.index, info.title, info.description, file)
    }
}

function buildNoteCardItem(index, title, description, fileBase64)
{
    if (fileBase64.endsWith('data:')) { fileBase64 = ""; }

    $( "#history-notes-article" ).prepend(
        $("<div>", {style: "display: flex; border: 1px solid rgba(36, 36, 36, 0.181); border-radius: 4px; padding: 2%; margin: 1%;"})
        .append(
            $("<input>", {type: "image", alt: "", src: fileBase64, style: "max-width: 20%; max-height: 20%; margin: 5px; align-self: center;"})
            .on("click", function () {
                window.open().document.write('<iframe src="' + fileBase64 + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
            })
        )
        .append(
            $("<div>", {style: "display: flex; flex-direction: column;"})
            .append(
                $("<span>", {style: "font-size: 95%; font-family: monospace; padding: 0 2%;"})
                .text(title)
            )
            .append(
                $("<span>", {style: "font-size: 90%; font-family: monospace; padding: 2%;"})
                .text(description)
            )
        )
    );

    // HTML RESULT
    //
    // <div style="display: flex; border: 1px solid rgba(36, 36, 36, 0.181); border-radius: 4px; padding: 2%">
    //     <input type="image" alt="" style="max-width: 20%; max-height: 20%; margin: 5px; align-self: center;" src="pictures/copies.png">                              
    //     <div style="display: flex; flex-direction: column;">
    //         <span style="font-size: 95%; font-family: monospace; padding: 0 2%;">Título</span>
    //         <span style="font-size: 90%; font-family: monospace; padding: 2%;">Descrição</span>
    //     </div>
    // </div>
}