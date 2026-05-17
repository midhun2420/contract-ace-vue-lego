import table from '@/data/Editor/Table';

export default [
    {
        type : 'editor-h1',
        prop : {
            value : 'lorem ipsum dollar sit amet'
        }
    },
    {
        type : 'editor-p',
        prop : {
            value : 'It me,\' was to MARMALADE\', right. I she question, her she dear. Dozing moment wonder There or she. Is they\'ll your the. You jumped that and to. Seemed couldn\'t said and as. Her hall, at think opened and. Jumped hurrying very things. Hurrying came great of. See, dark the and to is.\n' +
                'Pink she the her didn\'t toast. \'which a to great Do. Somebody, as in was it a. Book-shelves; and the down Antipathies, of. A noticed fifteen it tried. Was a wonder in that ran. It? and who did off it. Was when down Rabbit be herself. Wish mice then \'Now, too. No, go She too not the.\n' +
                'She centre down a. Alice true my the went down. She see you the sadly. Simple like of falling. Get nothing from not. Go bottle she bleeds; of. At second to with either. Put all or forgotten or wonder?. Hot tumbling the like. Rabbit here the nice were.\n' +
                'Sadly mixed from soon and. Noticed it, that bottle get. It down, pine-apple, was. Me a out looked to. No the to \'Oh the. This the wish turkey, mindas pictures. Down glass; found air! curiosity, to?. Reading, very think custard, too and. In worth the the feet. \'Oh anything go forgotten \'—but.\n' +
                'Few on a be well. In this, but across. Empty: again either, down, back \'No. Rate any pop she sleepy Presently. Spoke—fancy came this fall to she. Lock, having sitting to. Much Alice burnt, of. With marked time, the. Was all think me,. To the she shall.'
        }
    },
    {
        type : 'editor-table',
        prop : { ...table.table }
    },
    {
        type : 'editor-h2',
        prop : {
            value : 'BOQ Table'
        }
    },
    {
        type : 'editor-boq-table',
        prop : { ...table['boq-table'] }
    }
];
