let textarea = document.getElementById('text');
console.log(textarea);
sceditor.create(textarea, {
    format: 'xhtml',
    style: '/sceditor/minified/themes/modern.min.css', 
    emoticonsRoot: '/sceditor/'
});