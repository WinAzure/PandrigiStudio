const editorElement = document.getElementById('editor');
const codeMirrorEditor = CodeMirror.fromTextArea(editorElement, {
    lineNumbers: true,
    theme: 'dracula',
    mode: 'text/plain'
});

document.getElementById('languageSelector').addEventListener('change', function() {
    const language = this.value;
    const mode = getMode(language);
    codeMirrorEditor.setOption('mode', mode);
});

document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function importCode() {
    document.getElementById('fileInput').click();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            codeMirrorEditor.setValue(e.target.result);
            const fileExtension = getFileExtensionFromName(file.name);
            document.getElementById('languageSelector').value = fileExtension;
            const mode = getMode(fileExtension);
            codeMirrorEditor.setOption('mode', mode);
        };
        reader.readAsText(file);
    }
}

function exportCode() {
    const code = codeMirrorEditor.getValue();
    const filename = document.getElementById('filename').value.trim();
    const language = document.getElementById('languageSelector').value;

    if (filename === '') {
        alert('Please enter a filename.');
        return;
    }

    const fullFilename = `${filename}.${getFileExtension(language)}`;
    const mimeType = getMimeType(language);
    const blob = new Blob([code], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fullFilename;
    a.click();
    URL.revokeObjectURL(url);
}

function getFileExtension(language) {
    return language;
}

function getFileExtensionFromName(filename) {
    return filename.split('.').pop().toLowerCase();
}

function getMimeType(language) {
    switch (language) {
        case 'html': return 'text/html';
        case 'python': return 'text/x-python';
        case 'javascript': return 'application/javascript';
        case 'css': return 'text/css';
        default: return 'text/plain';
    }
}

function getMode(language) {
    switch (language) {
        case 'html': return 'htmlmixed';
        case 'python': return 'python';
        case 'javascript': return 'javascript';
        case 'css': return 'css';
        default: return 'text/plain';
    }
}

function openLivePreview() {
    const code = codeMirrorEditor.getValue();
    const language = document.getElementById('languageSelector').value;
    const newWindow = window.open();
    if (language === 'html') {
        newWindow.document.write(code);
    } else {
        newWindow.alert('Live Preview is only supported for HTML.');
        newWindow.close();
    }
}

function showLicense() {
    alert(`MIT License

Copyright (C) 2018 by Marijn Haverbeke <marijn@haverbeke.berlin>, Adrian
Heine <mail@adrianheine.de>, and others

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.`);
}
