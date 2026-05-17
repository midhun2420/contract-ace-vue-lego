<template>
    <div>
        <table class="table table-bordered">
            <thead>
            <tr>
                <th class="text-center" style="width: 10px">Item No</th>
                <ce tag="th" class="text-center" v-for="(title, i) in block.titles" :key="i" :params="[block.titles, i]"/>
                <th class="text-col text-center">Unit</th>
                <th class="text-col text-center">Quantity</th>
                <th class="text-col text-center">Rate</th>
                <th class="text-col text-center">Total</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, i) in block.rows" :key="i">
                <ce tag="td" :value="block.index[i]" :params="[block.index, i]" />
                <ce tag="td" v-for="(cell, j) in row" :key="i + '' + j" :value="row[j]" :params="[row, j]"/>
                <td>
                    <span  v-html="getValue('unit', i)" v-if="viewOnly"></span>
                    <validated-input v-else @input="input($event, 'unit', i)" :value="getValue('unit', i)" />
                </td>
                <td>
                    <span  v-html="getValue('quantity', i)" v-if="viewOnly"></span>
                    <validated-input :rules="number" type="number" name="Quantity" v-else @input="input($event, 'quantity', i); $forceUpdate();" :value="getValue('quantity', i)" />
                </td>
                <td>
                    <span  v-html="getValue('rate', i)" v-if="viewOnly"></span>
                    <validated-input :rules="number" type="number" name="Rate" v-else @input="input($event, 'rate', i); $forceUpdate();" :value="getValue('rate', i)" />
                </td>
                <td>
                    <span  v-html="getTotal(i)"></span>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import TableCommons from '@/component/Bidder/BaseComponent';

export default {
    name    : 'editor-boq-wo-qty-table',
    extends : TableCommons,
    data () {
        return {
            number : {
                min_value : 0
            }
        };
    },

    methods : {
        sendNumber (value) {
            if (value === undefined) {
                return '';
            }
            const iValue = parseInt(value, 10);
            if (isNaN(iValue)) {
                return '';
            }
            return iValue;
        },

        getRate (uid, index) {
            const rate = this.canvas.getValue([uid, 'rate', index]);
            return this.sendNumber(rate);
        },

        getQty (uid, index) {
            const qty = this.canvas.getValue([uid, 'quantity', index]);
            return this.sendNumber(qty);
        },

        getTotal (index) {
            const block = this.block;
            const uid = block._uid;
            const rate = this.getRate(uid, index);
            const qty = this.getQty(uid, index);
            if (rate === '' || qty === '') {
                return '';
            }
            return rate * qty;
        }
    }

};
</script>
