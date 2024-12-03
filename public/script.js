
tinymce.init({
    selector: 'textarea#editorTextarea',
    width: 910,
    height: 450,
    plugins:[
        'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
        'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 
        'table', 'emoticons', 'template', 'codesample'
    ],
    toolbar: 'undo redo | styles | bold italic underline | alignleft aligncenter alignright alignjustify |' + 
    'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
    'forecolor backcolor emoticons',
    menu: {
        favs: {title: 'menu', items: 'code visualaid | searchreplace | emoticons'}
    },
    menubar: 'favs file edit view insert format tools table',
    content_style: 'body{font-family:Helvetica,Arial,sans-serif; font-size:16px}'
});

// $('#editorForm').submit(function(event) {
//     event.preventDefault();
//     let content = tinymce.get('editorTextarea').getContent();

//     $.ajax({
//         url: '/saveContent',
//         method: 'POST',
//         contentType: 'application/json',
//         data: JSON.stringify({ content }),
//         success: function(response) {
//             console.log(response);
//             alert('Content saved successfully');
//         },
//         error: function(xhr, status, error) {
//             console.error(error);
//             alert('Error saving content');
//         }
//     });
// });

// function fetchContent() {
//     $.get('/getContent', function(response) {
//         if (response.content) {
//             $('#contentDisplay').html(response.content);
//         } else {
//             $('#contentDisplay').html('No content found');
//         }
//     }).fail(function() {
//         $('#contentDisplay').html('Error fetching content');
//     });
// }

// // Fetch content on page load
// fetchContent();
