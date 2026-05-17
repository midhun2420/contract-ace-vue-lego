import ContentEditable from '@/component/ContentEditable/ContentEditable';

export default {
    components : { ce : ContentEditable },

    props : {
        prop : {
            type     : Object,
            required : true
        },
        canvas : {
            type    : Object,
            default : null
        }
    },
    watch : {
        prop (value) {
            this.block = value;
            const el = this.$el;
            el.setAttribute('id', this.block._uid);
        }
    },
    data () {
        return { block : null, className : '' };
    },
    created () {
        this.block = this.prop;
    },
    beforeMount () {
        const block = this.block;

        if (!block._uid) {
            throw new Error('UUID is missing.');
        }

        this.className = block.alignment;
    },

    computed : {
    },

    methods : {
        align (value) {
            const block = this.block;
            block.alignment = value;
            this.className = value;
        }
    },

    mounted () {
        const options = this.$options;
        const componentName = options.label || options.name;
        const el = this.$el;
        if (el && el.setAttribute) {
            el.setAttribute('data-element-name', componentName);
            el.setAttribute('id', this.block._uid);
            console.log('---base component this.block--------', this.block);
            console.log('---base component this.block._uid--------', this.block._uid);
        }
    }
};
