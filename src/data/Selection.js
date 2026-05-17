/* eslint-disable no-unused-vars */
const msie = window.msie;
const getSelection = () => {
    return (msie) ? document.selection : (window.getSelection || document.getSelection)();
};

// range objects will differ between browsers
const getRange = () => {
    return (msie) ? getSelection().createRange() : getSelection().getRangeAt(0);
};

const insertSpan = (className, range, otherClasses) => {
    const span = document.createElement('span');
    const selection = range.cloneContents();
    span.appendChild(selection);

    const elements = span.querySelectorAll('.' + className);
    elements.forEach(function (element) {
        element.classList.remove(className);
    });

    if (otherClasses && otherClasses.forEach) {
        otherClasses.forEach(function (e) {
            const elements = span.querySelectorAll('.' + e);
            elements.forEach(function (element) {
                element.classList.remove(e);
            });
        });
    }

    const wrappedSelection = '<span class="' + className + '">' + span.innerHTML + '</span>';
    document.execCommand('insertHTML', false, wrappedSelection);
};

const getRangeHTML = (range) => {
    const span = document.createElement('span');
    span.appendChild(range.cloneContents());

    return span.textContent.trim();
};

const nodeHTML = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim();
    }

    return node.textContent.trim();
};

const getFirst = (range) => {
    const node = range.startContainer;
    if (node.nodeType === Node.TEXT_NODE) {
        return node.parentNode;
    }

    return node;
};

const addClass = (className, removeClasses) => {
    const range = getRange();
    const oFirst = getFirst(range);

    const sRangeHTML = getRangeHTML(range);
    const sFirstHTML = nodeHTML(oFirst);

    if (sRangeHTML === sFirstHTML) {
        if (removeClasses && removeClasses.forEach) {
            removeClasses.forEach(function (e) {
                oFirst.classList.remove(e);
            });
        }
        oFirst.classList.add(className);
        return;
    }

    insertSpan(className, range, removeClasses);
};

export default {
    getRange,
    addClass,
    insertSpan
};
