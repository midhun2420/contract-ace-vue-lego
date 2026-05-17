import BaseComponent from '@/component/Editor/BaseComponent';
import ContentEditable from '@/component/ContentEditable/ContentEditable';
import { mapGetters } from 'vuex';

export default {
    extends    : BaseComponent,
    components : { ce : ContentEditable },

    computed : {
        ...mapGetters(['editMode'])
    },

    beforeMount () {
        const block = this.block;

        if (!block.index) {
            block.index = {};
            const rows = block.rows;
            let len = rows.length;

            while (len > 0) {
                len -= 1;
                block.index[len] = len + 1;
            }
        }
    },

    methods : {
        addRow () {
            const block = this.block;
            const titles = block.titles;
            const rows = block.rows;
            const row = [];
            let len = titles.length;
            while (len > 0) {
                row.push('');
                len -= 1;
            }
            rows.push(row);
            block.index[rows.length] = rows.length;
        },

        moveRowUp (index) {
            if (index === 0) {
                return;
            }
            const block = this.block;
            const rows = block.rows;
            const row = rows.splice(index, 1)[0];
            rows.splice(index - 1, 0, row);

            const indexes = block.index;
            if (indexes) {
                const value = indexes[index];
                indexes[index] = indexes[index - 1];
                indexes[index - 1] = value;
            }
            block.index = { ...indexes };
        },

        moveRowDown (index) {
            const block = this.block;
            const rows = block.rows;
            if (index === rows.length - 1) {
                return;
            }
            const row = rows.splice(index, 1)[0];
            rows.splice(index + 1, 0, row);

            const indexes = block.index;
            if (indexes) {
                const value = indexes[index];
                indexes[index] = indexes[index + 1];
                indexes[index + 1] = value;
            }
            block.index = { ...indexes };
        },

        addColumn () {
            const block = this.block;
            const titles = block.titles;
            const rows = block.rows;
            let len = rows.length;
            titles.push('Title');
            while (len > 0) {
                len -= 1;
                const row = rows[len];
                row.push(' ');
            }
        },

        deleteRow (index) {
            const block = this.block;
            const rows = block.rows;
            let len = rows.length;
            rows.splice(index, 1);

            const indexes = block.index;
            while (len > index) {
                len -= 1;
                indexes[len] = indexes[len - 1];
            }
            block.index = { ...indexes };
        },

        deleteColumn (index) {
            const block = this.block;
            const titles = block.titles;
            const rows = block.rows;
            let len = rows.length;
            while (len > 0) {
                len -= 1;
                const row = rows[len];
                row.splice(index, 1);
            }
            titles.splice(index, 1);
        }
    }
};
