function uploadFile(){
  var file = document.getElementById("file")
  var formData = new FormData();
  var imgsrc = null;
  formData.append('file',file.files[0]);
  $.ajax({
    url: '/upload',
    type: 'POST',
    data: formData,
    async: false,
    cache: false,
    contentType: false,
    processData: false,
    success: function (data){
      if(200 === data.code) {
        $('#result').html("上传成功！");
        $('#img').attr('src','http://' + data.data.headersHost + '/images/' + data.data.name);
        $('#addimg').show();
        imgsrc = '/images/' + data.data.name
      } else {
        $('#result').html("上传失败！");
      }
    },
    error: function(){
      $("#result").html("与服务器通信发生错误");
    }
  });
  return imgsrc;
};


//myField 光标所在的控件名 document.Form.XXX 
//myValue 所要插入的值 
function insertAtCursor(myField, myValue) { 
  	// IE 
    if (document.selection)   
    {   
    	myField.focus();   
    	sel = document.selection.createRange();   
   
    	sel.text = myValue;   
    	sel.select();
    }   
		else if (myField.selectionStart || myField.selectionStart == '0') { 
      // MOZILLA/NETSCAPE support 
      //起始位置 
      var startPos = myField.selectionStart; 
      //结束位置 
      var endPos = myField.selectionEnd; 
      //插入信息 
      myField.value = myField.value.substring(0, startPos) 
          + myValue 
          + myField.value.substring(endPos, myField.value.length);
    } else { 

      //没有焦点的话直接加在TEXTAREA的最后一位 
      myField.value += myValue; 
    } 
}
function iaddimg() {
	var mytextarea = document.getElementById('mytextarea');
	var src = '![Alt text](' + uploadFile() + ')'	;
	insertAtCursor(mytextarea, src);
	// mytextarea.value += src;
}


window.onload = function () {

	if(!document.getElementById('upload')){
		return false
	}else{
		var uploada = document.getElementById('upload');
		uploada.addEventListener("click",function () {
			uploadFile();
		},false);
	}

	if(!document.getElementById('addimg')){
		return false;
	}else{
		var addimg = document.getElementById('addimg');
		addimg.addEventListener('click',function () {
			iaddimg();
		} ,false)
	}

}