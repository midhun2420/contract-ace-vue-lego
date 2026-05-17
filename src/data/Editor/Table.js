const table = {
    titles : [
        'Title 1',
        'Title 2',
        'Title 3'
    ],
    rows : [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ]
};

const boqTable = {
    titles : [
        'Description',
        'Unit',
        'Qty'
    ],
    rows : [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ]
};
const sotTable = {
    titles : [
        'Description'
    ],
    rows : [
        [''],
        [''],
        ['']
    ]
};

const boqWoQtyTable = {
    titles : [
        'Description'
    ],
    rows : [
        [''],
        [''],
        ['']
    ]
};

const mspMntTable = {
    titles : [
        'Description'
    ],
    rows : [
        [''],
        [''],
        ['']
    ]
};

const importExcelTable = {
    titles       : [],
    rows         : [],
    columns      : [],
    editableData : {},
    index        : {}
};

export default {
    table,
    'boq-table'        : boqTable,
    'sot-table'        : sotTable,
    'boq-wo-qty-table' : boqWoQtyTable,
    'msp-mnt-table'    : mspMntTable,
    'import-excel'     : importExcelTable
};
