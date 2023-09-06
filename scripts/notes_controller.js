$( document ).ready(
    function ()
    {
        //
        // handlers
        //

        $( document ).on("paste", notes_helper.notesPasteHandler);
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

        $( "#new-note-attach-file" ).on("change", notes_helper.changeFileNotesInputHandler);
        $( "#new-note-save" ).on("click", notes_helper.newNoteSaveHandler);
        $( "#new-note-clear" ).on("click", notes_helper.newNoteClearHandler);
        
        $( "#export-notes-btn" ).on("click", notes_helper.generateExportFile);
        $( "#import-notes-btn" ).on("click", notes_helper.importNoteFile);

        //
        // auto triggers
        //

        $( "#notes-component" ).children()[0].click();
        $( "#new-note-btn" ).trigger("click");
        $( "#new-note-title" ).trigger("focus");
    }
);

function buildHistoryNotesSection()
{
    $( "#history-notes-article" ).empty();

    let passBy = new Set();

    for (let item of Object.keys(localStorage))
    {
        if (!item.startsWith('annotation')) continue; // only annotations
        
        // get index by info || file
        let annotationIndex = notes_helper.getAnnotationIndex(item);

        // check/ add to pass by
        if (passBy.has(annotationIndex)) continue; passBy.add(annotationIndex);

        // get data
        let info = JSON.parse(localStorage.getItem('annotation'+annotationIndex+'-info'));
        let file = localStorage.getItem('annotation'+annotationIndex+'-file');

        buildNoteCardItem(info.index, info.title, info.description, info.checked, file);
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
                    $("<span>", {style: "font-size: 120%; font-family: monospace; padding: 0 2%;"})
                    .text(title)
                )
                .append(
                    $("<span>", {style: "font-size: 118%; font-family: monospace; padding: 2%;"})
                    .text(description)
                )
            )
        )

        // copy/trash/check buttons container
        .append(
            $("<div>", {style: "display: flex; flex-direction: column"})
            .append(
                $("<input>", {type: "image", alt: "check", src: "../pictures/notes/check.png", style: "max-width: 20px; max-height: 20px; margin: 3px; align-self: flex-end;"})
                .on("click", function () {
                    checked = (checked ? false : true);
                    localStorage.setItem(index+'-info', JSON.stringify({index: index, title: title, description: description, checked: checked}));

                    $(this).parent().parent().css("text-decoration", checked ? "line-through" : "auto")
                })
            )
            .append(
                $("<input>", {type: "image", alt: "trash", src: "../pictures/notes/trash.png", style: "max-width: 18px; max-height: 18px; margin: 3px; align-self: flex-end;"})
                .on("click", function () {
                    if (confirm("Excluir anotação?"))
                    {
                        localStorage.removeItem(index+'-info');
                        localStorage.removeItem(index+'-file');

                        $(this).parent().parent().remove();
                    } 
                })
            )
            .append(
                $("<input>", {type: "image", alt: "copy image", src: "../pictures/notes/copy-img.png", style: "max-width: 18px; max-height: 18px; margin: 3px; align-self: flex-end;"})
                .on("click", async function () {
                    // copy image
                    navigator.clipboard.write([
                        new ClipboardItem({
                            'image/png': await fetch(fileBase64).then((r) => r.blob())
                        })
                    ]);
                    $(this).attr("src", "../pictures/notes/copied-img.png");setTimeout(() => {$(this).attr("src", "../pictures/notes/copy-img.png");}, 1500);
                })
            )
            .append(
                $("<input>", {type: "image", alt: "copy text", src: "../pictures/notes/copy-text.png", style: "max-width: 18px; max-height: 18px; margin: 3px; align-self: flex-end;"})
                .on("click", async function () {
                    // copy description
                    navigator.clipboard.writeText(description);
                    $(this).attr("src", "../pictures/notes/copied-text.png");setTimeout(() => {$(this).attr("src", "../pictures/notes/copy-text.png");}, 1500);
                })
            )
        )

        // container text decoration
        .css("text-decoration", checked ? "line-through" : "auto")
    );
}