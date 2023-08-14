const helper = {

    //
    // NOTES
    //

    notesPasteHandler: function (event)
    {
        if (document.getElementById('notes-content').classList.contains('hidden')) { return; }

        const clipboard = event.originalEvent.clipboardData;
        let clipboard_files = clipboard.files;
        let clipboard_text = clipboard.getData("text");

        if (clipboard_files.length > 0)
        {
            helper.loadFilesIntoNotesInput(clipboard_files);
        }

        if (clipboard_text != '')
        {
            helper.loadTextIntoNotesInput(clipboard_text);
        }
    },
    loadFilesIntoNotesInput: function (files)
    {   
        let fileInput = document.getElementById('new-note-attach-file');
        fileInput.files = files;

        helper.changeFileNotesInputHandler();
    },
    changeFileNotesInputHandler: function ()
    {
        let fileInput = document.getElementById('new-note-attach-file');

        let fileInputLabel = document.getElementById('new-note-attach-file-label')
        fileInputLabel.innerText = fileInput.files[0]?.name ? fileInput.files[0]?.name : 'Nenhum arquivo selecionado';

        if (fileInput.files[0]?.type.startsWith("image"))
        {
            let imageOutput = document.getElementById('new-note-attach-img');
            imageOutput.src = URL.createObjectURL(fileInput.files[0]);
            imageOutput.onload = function() {
                URL.revokeObjectURL(imageOutput.src)
            }
        }
        else
        {
            let imageOutput = document.getElementById('new-note-attach-img');
            imageOutput.src = "";
            imageOutput.onload = function() {
                URL.revokeObjectURL(imageOutput.src)
            }
        }
    },
    loadTextIntoNotesInput: function (text)
    {
        let descriptionInput = document.getElementById('new-note-text');
        descriptionInput.value += text;
    },

    newNoteSaveHandler: function ()
    {
        localStorage.setItem('notes-count', Number(localStorage.getItem('notes-count'))+1);

        let index = ('annotation'+(localStorage.getItem('notes-count')));
        let title = document.getElementById("new-note-title");
        let description = document.getElementById("new-note-text");
        let file = document.getElementById("new-note-attach-file");

        
        let reader = new FileReader()
        reader.onload = function(base64) {
            localStorage.setItem(
                (index+'-info'),
                    JSON.stringify({
                        index: index,
                        title: title.value,
                        description: description.value,  
                    })
            );

            localStorage.setItem(
                (index+'-file'),
                    reader.result
            );

            title.value = "";
            description.value = "";
            file.value = "";

            helper.changeFileNotesInputHandler();
        }

        reader.readAsDataURL(file.files[0] ? file.files[0] : new Blob());                
    },
    newNoteClearHandler: function ()
    {
        if(confirm("Deseja limpar todo o histórico de anotações?") == true)
        {
            for (let i=1; i <= Number(localStorage.getItem('notes-count')); i++)
            {
                localStorage.removeItem('annotation'+i+'-info');
                localStorage.removeItem('annotation'+i+'-file');
            }
        }
        localStorage.setItem('notes-count', 0);
    },

    generateExportFile: function ()
    {
        const link = document.createElement("a");

        let content = {}

        for (let i=1; i <= Number(localStorage.getItem('notes-count')); i++)
        {
            content[('annotation'+i+'-info')] = localStorage.getItem(('annotation'+i+'-info'));
            content[('annotation'+i+'-file')] = localStorage.getItem(('annotation'+i+'-file'));
        }

        const file = new Blob([JSON.stringify(content)], { type: 'text/plain' });

        // Add file content in the object URL
        link.href = URL.createObjectURL(file);

        // Add file name
        link.download = prompt("Dê um nome para o arquivo de anotações: ");

        if (link.download != 'null')
        {
            link.click();
            URL.revokeObjectURL(link.href);
        }
    },

    importNoteFile: function ()
    {
        const input = document.createElement("input");
        input.type = "file";

        input.addEventListener("change", function () {
            let reader = new FileReader();
            reader.onload = (e) => {
                const content = JSON.parse(e.target.result);

                for (let k of Object.keys(content))
                {
                    localStorage.setItem(k, content[k]);
                    localStorage.setItem('notes-count', Number(localStorage.getItem('notes-count'))+0.5);
                }
            }

            reader.readAsText(input.files[0]);
        });
        
        input.click();
    }
}
