<template>
    <div>
        <table class="table table-bordered">
            <thead>
            <tr>
                <th class="text-center" style="width: 10px">Item No</th>
                <ce tag="th" class="text-center" v-for="(title, i) in block.titles" :key="i" :params="[block.titles, i]"/>
                <th class="text-col text-center">Rate</th>
                <th class="text-col text-center">Total</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, i) in block.rows" :key="i">
                <ce tag="td" :value="block.index[i]" :params="[block.index, i]" />
                <ce tag="td" v-for="(cell, j) in row" :key="i + '' + j" :value="row[j]" :params="[row, j]"/>
                <td>
                    <span  v-html="getValue('rate', i)" v-if="viewOnly"></span>
                    <validated-input :rules="number" type="number" name="Rate"  v-else @input="input($event, 'rate', i); $forceUpdate()" :value="getValue('rate', i)"/>
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
    name    : 'editor-boq-table',
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
            console.log('Inside BOQ Table ^^^^^^^^^^^^^^');
            const rate = this.canvas.getValue([uid, 'rate', index]);
            console.log('rate--------------', rate);
            console.log('rate returned--------------', this.sendNumber(rate));
            return this.sendNumber(rate);
        },

        getQty (index) {
            const rows = this.block.rows;
            const row = rows[index];
            const qty = row[2];
            console.log('quantity----------------', qty);
            console.log('quantity-returned---------------', this.sendNumber(qty));
            return this.sendNumber(qty);
        },

        getTotal (index) {
            const block = this.block;
            const uid = block._uid;
            const rate = this.getRate(uid, index);
            const qty = this.getQty(index);
            if (rate === '' || qty === '') {
                return '';
            }
            console.log('total------------------', rate * qty);
            return rate * qty;
        }
    }

};
</script>
