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
    },

    //
    // DUPLICATES
    //

    duplicatesInputOkHandler: function()
    {
        let input = document.getElementById("duplicates-input-text");

        const toUpper = document.getElementById("inputCaseUpper").checked;
        const toLower = document.getElementById("inputCaseLower").checked;
        const keep1 = document.getElementById("inputKeepOne").checked;

        // filter action
        let outputBeforeValues = input.value.split("\n");
        let outputAfterValues = helper.removeDuplicatesFromList(outputBeforeValues, toUpper, toLower, keep1);

        // result
        let outputAfterResult = document.getElementById("duplicates-output-result");
        outputAfterResult.innerHTML = outputAfterValues.join("<br>");

        // counts before/after
        let outputBeforeCount = document.getElementById("duplicates-output-before");
        let outputAfterCount = document.getElementById("duplicates-output-after");
        outputBeforeCount.innerHTML = 'Antes: ' + Number(outputBeforeValues.length);
        outputAfterCount.innerHTML = 'Depois: ' + Number(outputAfterValues.length);

        document.getElementById("duplicates-output-btn").click();
    },

    removeDuplicatesFromList: function (listDuplicates, toUpper, toLower, keep1) 
    {
        let map = {}; 
        let deletedKeys = {};
    
        for (let textLine of listDuplicates)
        {
            textLine = textLine.trim();

            let key;

            if (toUpper) { key = textLine.toUpperCase(); }
            if (toLower) { key = textLine.toLowerCase(); }
            if (!toUpper && !toLower) { key = textLine; }
    
            if ((map.hasOwnProperty(key) || deletedKeys.hasOwnProperty(key)) && !keep1) 
            {
                deletedKeys[key] = "";
                delete map[key];
                continue;
            }
    
            if (toUpper) { map[textLine.toUpperCase()] = ""; continue; }
            if (toLower) { map[textLine.toLowerCase()] = ""; continue; }
            if (!toUpper && !toLower) { map[key] = ""; continue; }
        }
        
        return Object.keys(map);
    }
}
