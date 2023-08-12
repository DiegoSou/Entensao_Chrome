$( document ).ready(
    function() 
    {
        loadDebugCsvComponent();
    }
);

function loadDebugCsvComponent() {
    $ ("#debug-csv-component").load("debugCsv.html");
}