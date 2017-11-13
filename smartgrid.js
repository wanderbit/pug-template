var smartgrid = require('smart-grid');

/* It's principal settings in smart grid project */
var settings = {
    outputStyle: 'scss', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    filename: "smartgrid",
    offset: '30px', /* gutter width px || % */
    container: {
        maxWidth: '1250px', /* max-width оn very large screen */
        fields: '30px' /* side fields */
    },
    breakPoints: {
        lg: {
            width: '1200px', /* -> @media (max-width: 1100px) */
            fields: '30px' /* side fields */
        },
        md: {
            width: '992px',
            fields: '15px'
        },
        sm: {
            width: '780px',
            fields: '15px'
        },
        xs: {
            width: '560px',
            fields: '15px'
        },
        oldSizeStyle: false
        /*
         We can create any quantity of break points.

         some_name: {
         some_width: 'Npx',
         some_offset: 'N(px|%)'
         }
         */
    }
};

smartgrid('./blocks/_base', settings);