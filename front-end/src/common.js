import 'vanilla-javascript';
import 'bootstrap';
import iframeResize from '@iframe-resizer/parent'

console.log("Hi!");

document.addEventListener('DOMContentLoaded', () => {
    iframeResize({ license: 'GPLv3', waitForLoad: true  }, '.iframe-autoresize' );

});

