let notes_helper = {};

$( document ).ready(function () 
{
    notes_helper = {
        notesPasteHandler: function (event)
        {
            if (document.getElementById('notes-content').classList.contains('hidden')) { return; }

            const clipboard = event.originalEvent.clipboardData;
            let clipboard_files = clipboard.files;
            let clipboard_text = clipboard.getData("text");

            if (clipboard_files.length > 0)
            {
                notes_helper.loadFilesIntoNotesInput(clipboard_files);
            }

            if (clipboard_text != '')
            {
                notes_helper.loadTextIntoNotesInput(clipboard_text);
            }
        },
        loadFilesIntoNotesInput: function (files)
        {   
            let fileInput = document.getElementById('new-note-attach-file');
            fileInput.files = files;

            notes_helper.changeFileNotesInputHandler();
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
            localStorage.setItem('notes-lastId', Number(localStorage.getItem('notes-lastId'))+1);

            let index = ('annotation' + (localStorage.getItem('notes-lastId')));
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

                notes_helper.changeFileNotesInputHandler();
            }

            reader.readAsDataURL(file.files[0] ? file.files[0] : new Blob());                
        },
        newNoteClearHandler: function ()
        {
            if(confirm("Deseja limpar todo o histórico de anotações?") == true)
            {
                Object.keys(localStorage).forEach((item) => {
                    if (item.startsWith('annotation'))
                    {
                        localStorage.removeItem(item);
                    }
                });
                
                localStorage.setItem('notes-lastId', 0);
            }
        },

        generateExportFile: function ()
        {
            const link = document.createElement("a");

            let content = {}

            Object.keys(localStorage).forEach((item) => {
                if (item.startsWith('annotation'))
                {
                    content[item] = localStorage.getItem(item);
                }
            });

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

            document.getElementById('new-note-btn').click();
        },

        importNoteFile: function ()
        {
            const input = document.createElement("input");
            input.type = "file";

            input.addEventListener("change", function () {
                let reader = new FileReader();
                
                reader.onload = (e) => {
                    localStorage.setItem('notes-lastId', 0);

                    const content = JSON.parse(e.target.result);
                    
                    Object.keys(content).forEach((item) => {
                        // set item
                        localStorage.setItem(item, content[item]);

                        // set last index for next notes
                        let annotationIndex = notes_helper.getAnnotationIndex(item);

                        if (Number(localStorage.getItem('notes-lastId')) < annotationIndex)
                        {
                            localStorage.setItem('notes-lastId',  annotationIndex);
                        }
                    });
                    
                    document.getElementById('history-notes-btn').click();
                }
                reader.readAsText(input.files[0]);
            });
            input.click();
        },

        getAnnotationIndex: function (item)
        {
            return Number(item.replace('annotation', '').replace('-info', '').replace('-file', ''));
        },
    }
});

