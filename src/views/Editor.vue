<template>
    <div class="pos-r">
        <div class="card" v-if="loading">
            <loading-animation/> Loading data
        </div>
        <Canvas :json="json" @save="onSave" v-else/>
    </div>
</template>

<script>
import One from '@/data/Samples/One';
import Canvas from '@/component/Editor/Canvas';

export default {
    name       : 'Home',
    components : {
        Canvas
    },
    data () {
        return {
            loading : true,
            prop    : {
                p     : 'Lorem ipsum dollar sir amet.',
                h1    : 'This is a header',
                table : {
                    titles : [
                        '<b>First</b> Name',
                        '<b>Last</b> Name',
                        '<b>Email</b> Address'
                    ],
                    rows : [
                        [
                            'Muhammed',
                            'K K',
                            'ajumell@xeoscript.com'
                        ],
                        [
                            'Ebrahim',
                            'K K',
                            'niju@xeoscript.com'
                        ],
                        [
                            'Risla',
                            'P N',
                            '<b>risla</b>@xeoscript.com'
                        ],
                        [
                            'Rayis',
                            'P N',
                            '<b>rayispn</b>@gmail.com'
                        ]
                    ]
                }
            },
            json : ''
        };
    },
    mounted () {
        this.loadData();
    },

    methods : {
        loadData () {
            const that = this;
            setTimeout(function () {
                that.json = JSON.stringify(One);
                that.loading = false;
            }, 1500);
        },
        onSave (json) {
            // Implement save here.
            alert('Save Clicked.');
            console.log(json);
        }

    }
};

</script>
