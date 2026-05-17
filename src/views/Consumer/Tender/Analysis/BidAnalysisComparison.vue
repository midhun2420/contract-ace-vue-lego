<template>
    <div>
        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style=" vertical-align: super"> Loading details....</span>
        </div>
        <div v-if="!loading" class="card">
            <div class="p-4">
                <div v-if="tender" class="row mb-3">
                    <div class="col"><b>Project Name</b> : {{ tender.name_of_project }}</div>
                </div>
                <div v-if="tender" class="row mb-3">
                    <div class="col"><b>Date of Report</b> : {{ tender.date_of_report }}</div>
                </div>
               <div v-for="(tableItem, tableIdx) in tables" :key="'table-' + tableIdx" class="row mb-4">

    <!-- LEFT SIDE -->
    <div class="col" style="width: 50%">
        <perfect-scrollbar>
            <table class="table table-bordered left-table">
                <thead>
                    <tr>
                        <td :colspan="tableItem.type === 'import-excel-table' ? tableItem.nonEditableFieldNames.length : 2">
                            <span v-if="tender"><b>Client Name</b> : {{ tender.name_of_client }}</span>
                        </td>
                    </tr>
                    <!-- Legacy headers -->
                    <tr v-if="tableItem.type !== 'import-excel-table'">
                        <td class="font-weight-bold">Item</td>
                        <td class="font-weight-bold">Description</td>
                    </tr>
                    <!-- Excel headers -->
                    <tr v-if="tableItem.type === 'import-excel-table'">
                        <td class="font-weight-bold" v-for="(fieldName, idx) in tableItem.nonEditableFieldNames" :key="idx">
                            {{ formatFieldName(fieldName) }}
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <!-- Legacy rows -->
                    <template v-if="tableItem.type !== 'import-excel-table'">
                        <tr v-for="(record, i) in tableItem.details1" :key="i">
                            <td v-for="(val, j) in record" :key="j"><pre>{{ val }}</pre></td>
                        </tr>
                    </template>
                    <!-- Excel rows -->
                    <template v-if="tableItem.type === 'import-excel-table'">
                        <tr v-for="(item, i) in tableItem.processedItems" :key="i">
                            <td v-for="(fieldName, j) in tableItem.nonEditableFieldNames" :key="j">
                                <pre>{{ item.contractors[0].non_editable_columns ? item.contractors[0].non_editable_columns[fieldName] : '-' }}</pre>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </perfect-scrollbar>
    </div>

    <!-- RIGHT SIDE -->
    <div class="col" style="width: 50%; margin: 0px !important;">
        <perfect-scrollbar>
            <!-- Legacy right table -->
            <table v-if="tableItem.type !== 'import-excel-table'" class="table table-bordered right-table">
                <thead>
                    <tr>
                        <td :colspan="tableItem.col_width" class="text-center font-weight-bold"
                            v-for="(record) in tableItem.data[0].contractors" :key="record.id">
                            <pre>{{ record.name }}</pre>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center font-weight-bold" v-for="(record, i) in tableItem.table_head" :key="i">
                            <pre>{{ record }}</pre>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(record, i) in tableItem.details" :key="i">
                        <td class="text-center" v-for="(val, j) in record" :key="j"><pre>{{ val }}</pre></td>
                    </tr>
                </tbody>
            </table>

            <!-- Excel right table -->
            <table v-if="tableItem.type === 'import-excel-table'" class="table table-bordered right-table">
                <thead>
                    <tr>
                        <td v-for="(contractor, idx) in tableItem.contractorNames" :key="idx"
                            :colspan="tableItem.editableFieldNames.length + tableItem.calculatedFieldNames.length"
                            class="text-center font-weight-bold">
                            <pre>{{ contractor }}</pre>
                        </td>
                    </tr>
                    <tr>
                        <template v-for="contractor in tableItem.contractorNames">
                            <td v-for="(fieldName, idx) in tableItem.editableFieldNames" :key="contractor + '-e-' + idx" class="text-center font-weight-bold">
                                <pre>{{ formatFieldName(fieldName) }}</pre>
                            </td>
                            <td v-for="(fieldName, idx) in tableItem.calculatedFieldNames" :key="contractor + '-c-' + idx" class="text-center font-weight-bold">
                                <pre>{{ formatFieldName(fieldName) }}</pre>
                            </td>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in tableItem.processedItems" :key="i">
                        <template v-for="(contractor, cIdx) in item.contractors">
                            <td v-for="(fieldName, fIdx) in tableItem.editableFieldNames" :key="cIdx + '-e-' + fIdx" class="text-center">
                                <pre>{{ contractor.editable_columns ? contractor.editable_columns[fieldName] : '-' }}</pre>
                            </td>
                            <td v-for="(fieldName, fIdx) in tableItem.calculatedFieldNames" :key="cIdx + '-c-' + fIdx" class="text-center">
                                <pre>{{ contractor.calculated_columns ? contractor.calculated_columns[fieldName] : '-' }}</pre>
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </perfect-scrollbar>
    </div>
</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'secure-axios';
import urls from '@/data/urls';

export default {
    name  : 'BidderAnalysisComparisonPage',
    props : { tender_id : { type : String } },
    data () {
        return {
            id                    : this.$route.params.id,
            permission            : true,
            loading               : false,
            details               : [],
            details1              : [],
            detail                : null,
            table_head            : [],
            col_width             : '',
            tender                : null,
            contractorNames       : [],
            editableFieldNames    : [],
            calculatedFieldNames  : [],
            nonEditableFieldNames : [],
            processedItems        : [],
            tables                : []
        };
    },
    mounted () {
        this.loadDetails();
    },
    methods : {
        formatFieldName (fieldName) {
            return fieldName
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        },

        extractDynamicFieldsForExcel (tableData) {
            if (!tableData || tableData.length === 0) return;

            const firstItem = tableData.find(item => item.contractors && item.contractors.length > 0);
            if (!firstItem) return;

            // Get contractor names - use company_name field
            this.contractorNames = firstItem.contractors.map(c => c.company_name || c.name);

            // Get field names dynamically from first contractor
            const firstContractor = firstItem.contractors[0];

            // Extract non-editable column keys (for LEFT table)
            if (firstContractor.non_editable_columns) {
                this.nonEditableFieldNames = Object.keys(firstContractor.non_editable_columns);
            }

            // Extract editable column keys (for RIGHT table)
            if (firstContractor.editable_columns) {
                this.editableFieldNames = Object.keys(firstContractor.editable_columns);
            }

            // Extract calculated column keys (for RIGHT table)
            if (firstContractor.calculated_columns) {
                this.calculatedFieldNames = Object.keys(firstContractor.calculated_columns);
            }

            // Store all items
            this.processedItems = tableData;
        },

        stripAnalysisDetails (table) {
            const initialData = this.detail;
            const data = [];
            const data1 = [];
            const tableHead = [];
            const tableBody = [];
            const subDetails = [];
            const arrayLength = initialData.length;
            for (let i = 0; i < arrayLength; i++) {
                var arrayLength1 = initialData[i].contractors.length;
                tableBody.push([initialData[i].index, initialData[i].description]);
                subDetails.push([]);
                for (let j = 0; j < arrayLength1; j++) {
                    if (table === 'boq-table' || table === 'boq-wo-qty-table') {
                        subDetails[i].push(
                            initialData[i].contractors[j].quantity,
                            initialData[i].contractors[j].unit,
                            initialData[i].contractors[j].rate,
                            initialData[i].contractors[j].total
                        );
                    } else if (table === 'sot-table') {
                        subDetails[i].push(
                            initialData[i].contractors[j].unit,
                            initialData[i].contractors[j].rate
                        );
                    } else if (table === 'msp-mnt-table') {
                        subDetails[i].push(
                            initialData[i].contractors[j].amount
                        );
                    }
                }
                data.push(subDetails);
                data1.push(tableBody);
            }
            for (let k = 0; k < arrayLength1; k++) {
                if (table === 'boq-table' || table === 'boq-wo-qty-table') {
                    tableHead.push('Quantity', 'Unit', 'Rate', 'Amount');
                    this.col_width = 4;
                } else if (table === 'sot-table') {
                    tableHead.push('Unit', 'Rate');
                    this.col_width = 2;
                } else if (table === 'msp-mnt-table') {
                    tableHead.push('Amount');
                    this.col_width = 1;
                }
            }
            this.details = data[data.length - 1];
            this.details1 = data1[data1.length - 1];
            this.table_head = tableHead;
        },

        loadDetails () {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.Tender.ComparisonAnalysisView, { tender_id : that.tender_id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.tender = json.tender;
                    const tableKeys = ['boq-table', 'boq-wo-qty-table', 'sot-table', 'msp-mnt-table', 'import-excel-table'];
                    that.tables = [];

                    tableKeys.forEach(key => {
                        if (json[key]) {
                            const tableObj = { type : key, data : json[key] };

                            if (key === 'import-excel-table') {
                                const groups = [];
                                let currentGroup = null;

                                json[key].forEach(item => {
                                    if (item.index === 1) {
                                        currentGroup = [];
                                        groups.push(currentGroup);
                                    }
                                    if (!currentGroup) {
                                        currentGroup = [];
                                        groups.push(currentGroup);
                                    }
                                    currentGroup.push(item);
                                });

                                groups.forEach((items, groupIdx) => {
                                    const firstItem = items.find(item => item.contractors && item.contractors.length > 0);
                                    if (!firstItem) return;

                                    const firstContractor = firstItem.contractors[0];

                                    that.tables.push({
                                        type                  : 'import-excel-table',
                                        groupIndex            : groupIdx + 1,
                                        data                  : items,
                                        contractorNames       : firstItem.contractors.map(c => c.company_name || c.name),
                                        nonEditableFieldNames : firstContractor.non_editable_columns ? Object.keys(firstContractor.non_editable_columns) : [],
                                        editableFieldNames    : firstContractor.editable_columns ? Object.keys(firstContractor.editable_columns) : [],
                                        calculatedFieldNames  : firstContractor.calculated_columns ? Object.keys(firstContractor.calculated_columns) : [],
                                        processedItems        : items
                                    });
                                });
                            } else {
                                // Process legacy table into tableObj
                                that.detail = json[key];
                                that.stripAnalysisDetails(key);
                                tableObj.details = [...that.details];
                                tableObj.details1 = [...that.details1];
                                tableObj.table_head = [...that.table_head];
                                tableObj.col_width = that.col_width;
                                that.tables.push(tableObj);
                            }
                        }
                    });
                    that.loading = false;
                    that.syncRowHeights();
                } else if (json.permission === false) {
                    that.permission = json.permission;
                    that.loading = false;
                    that.syncRowHeights();
                } else if (json.error === true) {
                    that.permission = json.permission;
                    that.loading = false;
                    that.syncRowHeights();
                }
            });
        },

        syncRowHeights () {
            this.$nextTick(() => {
                setTimeout(() => {
                    const leftTables = document.querySelectorAll('.left-table');
                    const rightTables = document.querySelectorAll('.right-table');

                    leftTables.forEach((leftTable, tableIndex) => {
                        const rightTable = rightTables[tableIndex];
                        if (!rightTable) return;

                        const leftRows = leftTable.querySelectorAll('tbody > tr');
                        const rightRows = rightTable.querySelectorAll('tbody > tr');

                        const totalRows = Math.min(leftRows.length, rightRows.length);

                        for (let i = 0; i < totalRows; i++) {
                            const leftRow = leftRows[i];
                            const rightRow = rightRows[i];

                            // RESET HEIGHT
                            leftRow.style.height = '';
                            rightRow.style.height = '';
                        }

                        for (let i = 0; i < totalRows; i++) {
                            const leftRow = leftRows[i];
                            const rightRow = rightRows[i];

                            const maxHeight = Math.max(
                                leftRow.offsetHeight,
                                rightRow.offsetHeight
                            );

                            leftRow.style.height = maxHeight + 'px';
                            rightRow.style.height = maxHeight + 'px';
                        }
                    });
                }, 200);
            });
        }
    }
};
</script>

<style scoped>
.text-small {
    font-weight: 500;
}

.form-control {
    border-radius: 5px;
}

th {
    font-size: 13px !important;
}
thead td,
thead th {
    white-space: nowrap;
    min-width: 80px;
}
.right-table td ,.left-table td {
    vertical-align: middle !important;
}
pre {
    font-family: Montserrat, sans-serif;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    margin: 0;
}
</style>
