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
                        <td :colspan="tableItem.isImportExcel ? tableItem.nonEditableFieldNames.length : 2">
                            <span v-if="tender"><b>Client Name</b> : {{ tender.name_of_client }}</span>
                        </td>
                    </tr>
                    <tr v-if="!tableItem.isImportExcel">
                        <td class="font-weight-bold">Item</td>
                        <td class="font-weight-bold">Description</td>
                    </tr>
                    <tr v-if="tableItem.isImportExcel">
                        <td class="font-weight-bold" v-for="(fieldName, idx) in tableItem.nonEditableFieldNames" :key="idx">
                            {{ formatFieldName(fieldName) }}
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="!tableItem.isImportExcel">
                        <tr v-for="(record, i) in tableItem.details1" :key="i">
                            <td v-for="(val, j) in record" :key="j"><pre>{{ val }}</pre></td>
                        </tr>
                    </template>
                    <template v-if="tableItem.isImportExcel">
                        <tr v-for="(item, i) in tableItem.processedItems" :key="i">
                            <td v-for="(fieldName, j) in tableItem.nonEditableFieldNames" :key="j">
                                <pre>{{ item.contractors[0].non_editable_fields ? item.contractors[0].non_editable_fields[fieldName] : '-' }}</pre>
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
            <table class="table table-bordered right-table">
                <thead>
                    <tr>
                        <td   class="text-center font-weight-bold heading"
                            v-for="(record) in tableItem.data[0].contractors" :key="record.id">
                            <pre v-if="!tableItem.isImportExcel">{{ record.name }}</pre>
                            <pre v-if="tableItem.isImportExcel">{{ record.company_name }}</pre>
                        </td>
                        <td class="text-center font-weight-bold heading"  ></td>
                    </tr>
                    <tr>
                        <td   class="text-center heading font-weight-bold"
                            v-for="(record) in tableItem.data[0].contractors" :key="record.id">Amount
                        </td>
                        <td class="text-center font-weight-bold heading"  >Average</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(record, i) in tableItem.details" :key="i">
                        <td   v-for="(val, j) in record" :key="j">
                            <div class="text-center" v-bind:style="selectColour(record, val)">
                                <pre>{{ val }}</pre>
                            </div>
                        </td>
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
    name  : 'BidderAnalysisComparisonAmountPage',
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
            tender                : null,
            isImportExcel         : false,
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

            const firstContractor = firstItem.contractors[0];

            // Extract non-editable field keys (for LEFT table) - Changed from non_editable_columns to non_editable_fields
            if (firstContractor.non_editable_fields) {
                this.nonEditableFieldNames = Object.keys(firstContractor.non_editable_fields);
            }

            // Store all items
            this.processedItems = tableData;
            this.isImportExcel = true;
        },

        selectColour (record, i) {
            const sortedArray = [];
            const arrayLength = record.length;
            for (let i = 0; i < arrayLength; i++) {
                if (typeof record[i] === 'number') {
                    sortedArray.push(record[i]);
                }
            }
            if (i === (Math.max(...sortedArray)) && (typeof i === 'number')) {
                const data = { background : '#f8696b', color : 'white' };
                return data;
            } else if (i === (Math.min(...sortedArray)) && (typeof i === 'number')) {
                const data = { background : '#63be7b', color : 'white' };
                return data;
            } else if (i > (Math.min(...sortedArray)) && i < (Math.max(...sortedArray)) && (typeof i === 'number')) {
                const data = { background : '#ffeb84', color : 'white' };
                return data;
            } else {
                const data = { fontWeight : 'bold', fontSize : '13px' };
                return data;
            }
        },

        stripAnalysisDetails () {
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
                    subDetails[i].push(
                        parseInt(initialData[i].contractors[j].amount)
                    );
                }
                const average = (initialData[i].averages).toString();
                subDetails[i].push(average);
                data.push(subDetails);
                data1.push(tableBody);
            }
            this.details = data[data.length - 1];
            this.details1 = data1[data1.length - 1];
            this.table_head = tableHead;
        },

        loadDetails () {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.Tender.ComparisonAmountAnalysisView, { tender_id : that.tender_id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    const tableKeys = ['boq-table', 'boq-wo-qty-table', 'sot-table', 'msp-mnt-table', 'import-excel-table'];
                    that.tables = [];

                    tableKeys.forEach(key => {
                        if (json[key]) {
                            const tableObj = { type : key, data : json[key] };

                            if (key === 'import-excel-table') {
                                const groups = [];
                                let currentGroup = null;

                                json[key].forEach(item => {
                                    if (Number(item.index) === 1) {
                                        currentGroup = [];
                                        groups.push(currentGroup);
                                    }

                                    if (!currentGroup) {
                                        currentGroup = [];
                                        groups.push(currentGroup);
                                    }

                                    currentGroup.push(item);
                                });

                                groups.forEach(groupItems => {
                                    const firstItem = groupItems.find(
                                        item => item.contractors && item.contractors.length > 0
                                    );

                                    if (!firstItem) return;

                                    const firstContractor = firstItem.contractors[0];

                                    that.detail = groupItems;
                                    that.stripAnalysisDetails();

                                    that.tables.push({
                                        type                  : 'import-excel-table',
                                        data                  : groupItems,
                                        nonEditableFieldNames : firstContractor.non_editable_fields
                                            ? Object.keys(firstContractor.non_editable_fields)
                                            : [],
                                        processedItems : groupItems,
                                        isImportExcel  : true,
                                        details        : [...that.details],
                                        details1       : [...that.details1]
                                    });
                                });

                                return;
                            } else {
                                that.detail = json[key];
                                that.stripAnalysisDetails();
                                tableObj.details = [...that.details];
                                tableObj.details1 = [...that.details1];
                                tableObj.isImportExcel = false;
                            }

                            that.tables.push(tableObj);
                        }
                    });
                    that.tender = json.tender;
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

                    leftTables.forEach((leftTable, index) => {
                        const rightTable = rightTables[index];
                        if (!rightTable) return;

                        const leftRows = leftTable.querySelectorAll('tbody tr');
                        const rightRows = rightTable.querySelectorAll('tbody tr');

                        leftRows.forEach((leftRow, i) => {
                            const rightRow = rightRows[i];
                            if (!rightRow) return;

                            // RESET
                            leftRow.style.height = 'auto';
                            rightRow.style.height = 'auto';

                            const maxHeight = Math.max(
                                leftRow.getBoundingClientRect().height,
                                rightRow.getBoundingClientRect().height
                            );

                            // APPLY SAME HEIGHT
                            leftRow.style.height = maxHeight + 'px';
                            rightRow.style.height = maxHeight + 'px';

                            // FORCE ALL TDs ALSO
                            leftRow.querySelectorAll('td').forEach(td => {
                                td.style.height = maxHeight + 'px';
                            });

                            rightRow.querySelectorAll('td').forEach(td => {
                                td.style.height = maxHeight + 'px';
                            });
                        });
                    });
                }, 300);
            });
        }
    }
}
;
</script>

<style scoped>
.text-small {
    font-weight: 500;
}

.form-control {
    border-radius: 5px;
}

th, .heading {
    font-size: 13px !important;
}
thead td,
thead th {
    white-space: nowrap;
    min-width: 80px;
}
.left-table td,
.right-table td {
    vertical-align: middle !important;
    padding-top: 18px !important;
    padding-bottom: 18px !important;
}
pre {
    font-family: Montserrat, sans-serif;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    margin: 0;
}
</style>
