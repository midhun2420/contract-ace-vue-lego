<template>
    <div>
        <table class="table table-bordered">
            <thead>
            <tr>
                <th class="text-center" style="width: 10px">Item No</th>
                <ce tag="th" class="text-center" v-for="(title, i) in block.titles" :key="i" :params="[block.titles, i]"/>
                <th class="text-col text-center">Unit</th>
                <th class="text-col text-center">Rate</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, i) in block.rows" :key="i">
                <ce tag="td" :value="block.index[i]" :params="[block.index, i]" />
                <ce tag="td" v-for="(cell, j) in row" :key="i + '' + j" :value="row[j]" :params="[row, j]"/>
                <td>
                    <span v-html="getValue('unit', i)" v-if="viewOnly"></span>
                    <validated-input v-else @input="input($event, 'unit', i)" :value="getValue('unit', i)"/>
                </td>
                <td>
                    <span v-html="getValue('rate', i)" v-if="viewOnly"></span>
                    <validated-input :rules="number" type="number" name="Rate" v-else @input="input($event, 'rate', i)" :value="getValue('rate', i)"/>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import TableCommons from '@/component/Bidder/BaseComponent';

export default {
    name    : 'editor-sot-table',
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
