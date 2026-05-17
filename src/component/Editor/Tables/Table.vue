<template>
    <div class="wrapper">
        <table class="table table-bordered">
            <thead>
            <tr>
               <ce @align="align" tag="th" v-for="(title, i) in block.titles" :key="'title-' + i" :params="[block.titles, i]"/>

                <td v-if="editMode">
                    <btn size="xs" text="Add Column" color="secondary" @click="addColumn"/>
                </td>
            </tr>
            </thead>
            <tbody>
           <tr v-for="(row, i) in block.rows" :key="'row-' + block.index[i]">
               <ce @align="align" tag="td" v-for="(cell, j) in row" :key="block.index[i] + '-' + j + '-' + block.titles.length" :value="row[j]" :params="[row, j]"/>
                <td v-if="editMode">
                    <div class="btn-group btn-group-tight1">
                        <btn size="xs" icon="fa fa-chevron-up" color="info" @click="moveRowUp(i)"/>
                        <btn size="xs" icon="fa fa-trash" color="danger" @click="deleteRow(i)"/>
                        <btn size="xs" icon="fa fa-chevron-down" color="info" @click="moveRowDown(i)"/>
                    </div>
                </td>
            </tr>
            <tr v-if="editMode">
                <td v-for="(title, i) in block.titles" :key="i">
                    <btn size="xs" text="Delete Column" color="danger" @click="deleteColumn(i)"/>
                </td>
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
    name    : 'editor-table',
    extends : TableCommons,

    methods : {
        addColumn () {
            const block = this.block;
            const titles = block.titles;
            const rows = block.rows;

            titles.push('Title');

            rows.forEach(row => {
                row.push('');
            });

            this.$set(this.block, 'titles', [...titles]);
            this.$set(this.block, 'rows', [...rows]);
        },
        deleteColumn (index) {
            this.block.titles.splice(index, 1);

            this.block.rows.forEach(row => {
                row.splice(index, 1);
            });
            this.$set(this.block, 'titles', [...this.block.titles]);
            this.$set(this.block, 'rows', this.block.rows.map(row => [...row]));
            this.$forceUpdate();
        }
    }
};
</script>
<style scoped>
.wrapper {
    overflow-x: auto;
}
</style>
