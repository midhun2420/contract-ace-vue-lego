<template>
    <div class="container mt-4 card bs-3">
        <h3 v-html="title"></h3>
        <ul class='tabs-header'>
            <li v-for='(tab, index) in data' :key='index' @click='selectTab(index)' :class='{"tab-selected": (index === selectedIndex)}'>
                {{ tab.tabName }}
            </li>
            <li class="fl-gr-1" style="border: 0"></li>
            <slot>
                <li>
                    <i class="fa fa-save mr-1"></i>
                    Save
                </li>
            </slot>
        </ul>

        <div class="tabs-container p-3">
            <component :canvas="that" :is="item.type" :prop="item.prop" v-for="(item, index) in selectedData" :key="index" @input="onInput"/>
        </div>
    </div>

</template>

<script>

import BaseCanvas from '@/component/Bidder/BaseCanvas';

export default {
    extends : BaseCanvas,

    data () {
        return {
            selectedIndex : null,
            selectedData  : []
        };
    },

    methods : {

        getJSON () {
            return JSON.stringify(this.variables, null, 4);
        },

        getVariableJSON () {
            return JSON.stringify(this.variables, null, 4);
        },

        onInput (params, value) {
            const [uid, name, index] = params;
            if (name === undefined && index === undefined) {
                this.variables[uid] = value;
                return;
            }

            let len = params.length - 1;
            let current = this.variables;
            for (let i = 0; i < len; i += 1) {
                const p = params[i];
                if (p === undefined) {
                    len -= 1;
                } else {
                    if (current[p] === undefined) {
                        current[p] = {};
                    }
                    current = current[p];
                }
            }
            const param = params[len];
            current[param] = value;

            // console.log(JSON.stringify(this.variables, null, 4));
        },

        selectTab (index = 0, force = false) {
            if (this.selectedIndex === index && force === false) {
                return;
            }
            this.selectedIndex = index;
            this.selectedData = this.data[index].data;
        }
    }

};

</script>
