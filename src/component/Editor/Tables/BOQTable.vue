<template>
    <div>
        <table class="table table-bordered">
            <thead>
            <tr>
                <th style="width: 10px">Item No</th>
                <ce @align="align" tag="th" v-for="(title, i) in block.titles" :key="i" :params="[block.titles, i]"/>
                <th class="text-col">Rate</th>
                <th class="text-col">Total</th>
                <td v-if="editMode"></td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, i) in block.rows" :key="i">
                <ce @align="align" tag="td" :value="block.index[i]" :params="[block.index, i]"/>
                <ce @align="align" tag="td" v-for="(cell, j) in row" :key="i + '' + j" :value="row[j]" :params="[row, j]"/>
                <td><validated-input /></td>
                <td></td>
                <td v-if="editMode">
                    <div class="btn-group btn-group-tight1">
                        <btn size="xs" icon="fa fa-chevron-up" color="info" @click="moveRowUp(i)"/>
                        <btn size="xs" icon="fa fa-trash" color="danger" @click="deleteRow(i)"/>
                        <btn size="xs" icon="fa fa-chevron-down" color="info" @click="moveRowDown(i)"/>
                    </div>
                </td>
            </tr>
            <tr v-if="editMode">
                <td></td>
                <td v-for="(title, i) in block.titles" :key="i">
                </td>
                <td class="text-col"></td>
                <td class="text-col"></td>
                <td class="text-col">
                    <btn size="xs" text="Add Row" color="secondary" @click="addRow"/>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import TableCommons from '@/component/Editor/Tables/TableCommons';

export default {
    name    : 'editor-boq-table',
    extends : TableCommons

};
</script>
