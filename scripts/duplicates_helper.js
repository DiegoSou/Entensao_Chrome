let duplicates_helper = {};

$( document ).ready(function () 
{
    duplicates_helper = {
        duplicatesInputOkHandler: function()
        {
            let input = document.getElementById("duplicates-input-text");

            const toUpper = document.getElementById("inputCaseUpper").checked;
            const toLower = document.getElementById("inputCaseLower").checked;
            const keep1 = document.getElementById("inputKeepOne").checked;
            const alphabeticalOrder = document.getElementById("inputAlphabeticalOrder").checked;

            // filter action
            let outputBeforeValues = input.value.split("\n");
            let outputAfterValues = duplicates_helper.removeDuplicatesFromList(outputBeforeValues, toUpper, toLower, keep1, alphabeticalOrder);

            // result
            let outputAfterResult = document.getElementById("duplicates-output-result");
            outputAfterResult.innerHTML = outputAfterValues.join("<br>");

            navigator.clipboard.writeText(outputAfterValues.join("\n"));

            // counts before/after
            let outputBeforeCount = document.getElementById("duplicates-output-before");
            let outputAfterCount = document.getElementById("duplicates-output-after");
            outputBeforeCount.innerHTML = 'Antes: ' + Number(outputBeforeValues.length);
            outputAfterCount.innerHTML = 'Depois: ' + Number(outputAfterValues.length);

            document.getElementById("duplicates-output-btn").click();
        },
        removeDuplicatesFromList: function (listDuplicates, toUpper, toLower, keep1, alphabeticalOrder) 
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
            
            if (alphabeticalOrder)
                return Object.keys(map).sort();
            
            return Object.keys(map);
        }
    }
});