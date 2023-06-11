var fileText;
var sourceId;

function sendAjaxRequest() {
    $.post( "/load_graph",
    {
        fileText: fileText,
        sourceId: sourceId,
    }, function( data ) {
        console.log(data)
    });
}

function sendAjaxRequestSearch(input) {
    $.get( "/search",
    {
        input: input
    }, function( data ) {
        console.log(data);
        location.reload();
        return false;
    });
}

function sendAjaxRequestFilter(input) {
    $.get( "/filter",
    {
        input: input
    }, function( data ) {
        console.log(data);
        location.reload();
        return false;
    });
}



$(document).ready(function (){
    const fileInput = document.getElementById("inputFile");
    fileInput.onchange = () => {

      const selectedFile = fileInput.files[0];
      let reader = new FileReader();

      if(!selectedFile) return;

      console.log(selectedFile.name.endsWith('.json'));
      if(selectedFile.name.endsWith('.json')){
        sourceId = "json-data-load";
      }
      else if(selectedFile.name.endsWith('.xml')){
        sourceId = "xml-data-load";
      }
      else{
        alert("Unsupported file type");
        return;
      }

      reader.readAsText(selectedFile);

      reader.onload = function () {
        fileText = reader.result;
        sendAjaxRequest();
      };

      reader.onerror = function () {
        console.log(reader.error);
      };
    };

    $( "#searchButton" ).click(function() {
      var str = $("#valueForSearch").val();
      sendAjaxRequestSearch(str)
    });


    $( "#filterButton" ).click(function() {
        var operators = ["==", "!=", "<=", ">=", "<", ">"]
      var str = $("#valueForFilter").val();
      $("#valueForFilter").val("")
        var op = null;
      let re = new RegExp("^[a-z0-9]+$");
      for (operator of operators){
          if (str.includes(operator)){
              op = operator;
          }
      }

      if (op == null){
          alert("Syntax error!Try again with other pattern.")
      }else{
          var tokens = str.split(op);
          if (tokens.length !== 2){
              alert("Syntax error!Try again with other pattern.")
          }else {
              sendAjaxRequestFilter(str)
          }
      }
    });

     $( "#restartButton" ).click(function() {
          $.get( "/restart",
        {
        }, function( data ) {
            console.log(data);
            location.reload();
            return false;
        });
    });

});