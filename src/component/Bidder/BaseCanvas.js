import Paragraph from '@/component/Bidder/Text/Paragraph';
import Heading1 from '@/component/Bidder/Text/Heading1';
import Heading2 from '@/component/Bidder/Text/Heading2';
import Heading3 from '@/component/Bidder/Text/Heading3';
import Heading4 from '@/component/Bidder/Text/Heading4';
import Heading5 from '@/component/Bidder/Text/Heading5';
import Heading6 from '@/component/Bidder/Text/Heading6';

import TextInput from '@/component/Bidder/Forms/TextInput';
import PasswordInput from '@/component/Bidder/Forms/PasswordInput';
import TextArea from '@/component/Bidder/Forms/TextArea';

import BOQTable from '@/component/Bidder/Tables/BOQTable';
import BOQWOQTYTable from '@/component/Bidder/Tables/BOQWOQTYTable';
import MSPMntTable from '@/component/Bidder/Tables/MSPMntTable';
import SoTTable from '@/component/Bidder/Tables/SoTTable';
import Table from '@/component/Bidder/Tables/Table';
import OrderedList from '@/component/Bidder/Lists/OrderedList';
import ImportExcelTable from './Tables/ImportExcelTable.vue';

export default {
    components : {

        'editor-p'  : Paragraph,
        'editor-h1' : Heading1,
        'editor-h2' : Heading2,
        'editor-h3' : Heading3,
        'editor-h4' : Heading4,
        'editor-h5' : Heading5,
        'editor-h6' : Heading6,

        'editor-text-input'     : TextInput,
        'editor-password-input' : PasswordInput,
        'editor-text-area'      : TextArea,

        'editor-ol' : OrderedList,

        'editor-boq-table'        : BOQTable,
        'editor-boq-wo-qty-table' : BOQWOQTYTable,
        'editor-sot-table'        : SoTTable,
        'editor-table'            : Table,
        'editor-msp-mnt-table'    : MSPMntTable,
        'editor-import-excel'     : ImportExcelTable
    },

    props : {
        json : {
            type    : String,
            default : ''
        },
        variableJson : {
            type    : String,
            default : ''
        },
        title : {
            type    : String,
            default : 'Editor Canvas'
        }
    },

    data () {
        return {
            variables : {},
            that      : this,
            data      : []
        };
    },

    created () {
        this.setJSON(this.json);
        this.setVariableJSON(this.variableJson);
    },

    methods : {
        getValue (params) {
            const [uid, name, index] = params;
            if (name === undefined && index === undefined) {
                return this.variables[uid];
            }
            let len = params.length - 1;
            let current = this.variables;

            for (let i = 0; i < len; i += 1) {
                const p = params[i];
                if (p === undefined) {
                    len -= 1;
                } else {
                    if (current[p] === undefined) {
                        return '';
                    }
                    current = current[p];
                }
            }
            const param = params[len];
            return current[param];
        },

        setJSON (json) {
            const defaultValue = [
                {
                    tabName : 'First Tab',
                    data    : []
                }
            ];
            try {
                const data = JSON.parse(json);

                if (!Array.isArray(data) || data.length === 0) {
                    this.data = defaultValue;
                    return;
                }

                // Automatically convert the no tab layout to tab layout
                if (data[0].tabName === undefined) {
                    console.log('[canvas]', '[set-json]', 'no tab name');
                    this.data = [
                        {
                            tabName : 'First Tab',
                            data    : data
                        }
                    ];
                } else {
                    this.data = data;
                }

                console.log('data', this.data);

                this.selectTab(0, true);
            } catch (e) {
                console.log(e);
                this.data = defaultValue;
            }
        },

        setVariableJSON (json) {
            const defaultValue = {};
            try {
                const data = JSON.parse(json);
                if (!data) {
                    this.variables = defaultValue;
                } else {
                    this.variables = data;
                }
            } catch (e) {
                console.log(e);
                this.data = defaultValue;
            }
        },

        selectTab () {}
    },

    watch : {
        json (newValue) {
            this.setJSON(newValue);
        },

        variableJson (newValue) {
            this.setVariableJSON(newValue);
        }
    }
};
