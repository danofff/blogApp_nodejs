//rate post
const plusButton = $('#addPlusToPostButton');
const minusButton = $('#addMinusToPostButton');

plusButton.click(e => {
    rateThisPost('plus');
})
minusButton.click(e => {
    rateThisPost('minus');
})


//add to favorite post
const addToFavoriteButton = $('#addToFavorite');
addToFavoriteButton.click(e=> {
    const form = $('#addToFavoriteForm');
    $.ajax({
        type: "POST",
        url: form.attr('action'),
        data: form.serialize(),
        dataType: "html",
        success: response => {
            $('#favoriteAlert')
            .removeAttr('hidden')
            .find('.alert')
            .text(response);
        },
        error: response => {
            console.log(response);
            $('#favoriteAlert')
            .removeAttr('hidden')
            .find('.alert')
            .removeClass('alert-success')
            .addClass('alert-danger')
            .text(response.responseText);
        }
    });
})

//add new comment
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
        success:  response => {
            commentTextArea.val('');
            $('#commentWarning')
            .html('Ваш комментарий успешно добавлен')
            .css('display', 'block')
            .removeClass('alert-danger')
            .addClass('alert-success');

            $('.comments-container').append(response);
            const del = $('.comments-container').last().find('.delete');
            del.click( e => {
                deleteComment(e);
            })
            const edit = $('.comments-container').last().find('.edit');
            edit.click(e => {
                editComment(e);
            })
        },
        error: response => {
            $('#commentWarning')
            .addClass('alert-danger')
            .html('Нельзя добавить комментарий')
            .css('display', 'block');
        }
    });
});

// delete comment
const deleteCommentButtons = $('.delete');
deleteCommentButtons.click(e => {
    deleteComment(e);
});


//edit comment
const editCommentButtons = $('.edit');
editCommentButtons.click(e =>{
    editComment(e);   
});


function deleteComment(e){
    const deleteCommentForm = $(e.currentTarget).parent().find('.deleteCommentForm');
    $.ajax({
        type: "POST",
        url: deleteCommentForm.attr('action'),
        data: deleteCommentForm.serialize(),
        dataType: "html",
        success: (response) => {
            deleteCommentForm.parent().parent().parent().parent().fadeOut(500, () => $(this).remove());
        },
        error: (response) => {

        }
    });
}

function editComment(e){
    const editFormDiv = $(e.currentTarget).parent().find('.editFormDiv').fadeIn(500).attr('hidden', false);
    const commentTextParagraph = $(e.currentTarget).parent().parent().find('p');
    const commentText = commentTextParagraph.text();
    const path =$(e.currentTarget).attr('data-path');
    
    editFormDiv.find('.editCommentTextarea').text(commentText);

    const editForm = editFormDiv.find('.editForm');

    editFormDiv.find('.cancelEdit').click(eInner =>{
        editFormDiv.fadeOut(500, () => { $(this).remove()});
    });

    editFormDiv.find('.submitEdit').click(innerEvent => {
        $.ajax({
            type: "POST",
            url: path,
            data: editForm.serialize(),
            dataType: "html",
            success: response => {
                commentTextParagraph.html(response);
                editFormDiv.fadeOut(500, () => { $(this).remove()});
            }
        });
    })
}

function rateThisPost(rateTo) {
    const form = $("#ratePostForm");
    form.find('#rateHandler').val(rateTo);
    $.ajax({
        type: "POST",
        url: form.attr('action'),
        data: form.serialize(),
        dataType: "html",
        success: response => {
            console.log(response);
            $('#rate').text(response);
        },
        error: response => {
            $('#rateAlert').removeAttr('hidden');
            $('#rateAlert').find('.alert').text(response.responseText);
        }
    });
}

