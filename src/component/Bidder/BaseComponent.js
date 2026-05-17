import ContentEditable from '@/component/ContentEditable/ContentEditablePlayer';

export default {
    components : { ce : ContentEditable },

    props : {
        prop : {
            type     : Object,
            required : true
        },
        viewOnly : {
            type    : Boolean,
            default : false
        },
        canvas : {
            type    : Object,
            default : null
        }
    },
    watch : {
        prop (value) {
            this.block = value;
        }
    },

    methods : {
        input (value, name, index) {
            const block = this.block;
            const uid = block._uid;
            this.$emit('input', [uid, name, index], value);
        },

        getValue (name, index) {
            const block = this.block;
            const uid = block._uid;
            const canvas = this.canvas;

            return canvas.getValue([uid, name, index]);
        },

        align (value) {
            const block = this.block;
            block.alignment = value;
        }
    },

    computed : {
        className () {
            const block = this.block;
            const align = block.alignment;

            return align || '';
        }

    },

    data () {
        return { block : null };
    },
    created () {
        this.block = this.prop;
    }

};
