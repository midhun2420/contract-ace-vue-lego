<template>
    <div>
        <table class="table table-bordered">
            <thead>
            <tr>
                <ce tag="th" class="text-center" v-for="(title, i) in block.titles" :key="i" :params="[block.titles, i]"/>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, i) in block.rows" :key="i">
                <ce tag="td" v-for="(cell, j) in row" :key="i + '' + j" :value="row[j]" :params="[row, j]"/>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import TableCommons from '@/component/Bidder/BaseComponent';

export default {
    name    : 'editor-table',
    extends : TableCommons

};
</script>
