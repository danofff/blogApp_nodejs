const commentForm = $('#commentForm');
const commentButton = $('#sendCommentButton');

commentButton.click( (e) => {
    const commentTextArea = $('#commentText');
    const commentText = commentTextArea.val();
    if(commentText.length<=0){
        $('#commentWarning')
        .addClass('alert-danger')
        .html('Вы пытаетесь отправить пустой комментарий')
        .css('display', 'block');
        return;
    }

    $.ajax({
        type: commentForm.attr('method'),
        url: commentForm.attr('action'),
        data: commentForm.serialize(),
        dataType: "html",
        success:  (response) => {
        commentTextArea.val('');
         $('#commentWarning')
        .html('Ваш комментарий успешно добавлен')
        .css('display', 'block')
        .removeClass('alert-danger')
        .addClass('alert-success');
        const addedComment = JSON.parse(response);
        }
    });
});