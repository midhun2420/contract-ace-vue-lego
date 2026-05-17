<template>
    <div>
        <table class="table table-bordered">
            <thead>
            <tr>
                <th class="text-center" style="width: 10px">Item No</th>
                <ce tag="th" class="text-center" v-for="(title, i) in block.titles" :key="i" :params="[block.titles, i]"/>
                <th class="text-col text-center">Amount</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, i) in block.rows" :key="i">
                <ce tag="td" :value="block.index[i]" :params="[block.index, i]" />
                <ce tag="td" v-for="(cell, j) in row" :key="i + '' + j" :value="row[j]" :params="[row, j]"/>
                <td>
                    <span v-html="getValue('amount', i)" v-if="viewOnly"></span>
                    <validated-input :rules="number" type="number" name="Amount" v-else @input="input($event, 'amount', i)" :value="getValue('amount', i)"/>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import TableCommons from '@/component/Bidder/BaseComponent';

export default {
    name    : 'editor-msp-mnt-table',
    extends : TableCommons,
    data () {
        return {
            number : {
                min_value : 0
            }
        };
    }

};
</script>
