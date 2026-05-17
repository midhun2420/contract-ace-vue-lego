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
                    <div class="col"><b>Client Name</b> : {{ tender.name_of_client }}</div>
                    <div class="col"><b>Date Of Report</b> : {{ tender.date_of_report }}</div>
                </div>
               <div v-for="(tableItem, tableIdx) in tables" :key="'table-' + tableIdx" class="row mb-4">

    <!-- LEFT SIDE -->
    <div class="col" style="width: 50%">
        <perfect-scrollbar>
            <table class="table table-bordered left-table">
                <thead>
                    <tr>
                        <td class="font-weight-bold">Item</td>
                        <td class="font-weight-bold">Description</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(record, i) in tableItem.details1" :key="i">
                        <td v-for="(val, j) in record" :key="j"><pre>{{ val }}</pre></td>
                    </tr>
                </tbody>
            </table>
        </perfect-scrollbar>
    </div>

    <!-- RIGHT SIDE -->
    <div class="col" style="width: 50%; margin: 0px !important;">
        <perfect-scrollbar>
            <table class="table table-bordered  right-table">
                <thead>
                    <tr>
                        <td colspan="2" class="text-center font-weight-bold heading"
                            v-for="(record) in tableItem.data[0].contractors" :key="record.id">
                            <pre v-if="!tableItem.isImportExcel">{{ record.name }}</pre>
                            <pre v-if="tableItem.isImportExcel">{{ record.company_name }}</pre>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(record, i) in tableItem.details" :key="i">
                        <td colspan="2" v-for="(val, j) in record" :key="j">
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
    name  : 'BidderAnalysisCumulativePage',
    props : { tender_id : { type : String } },
    data () {
        return {
            id            : this.$route.params.id,
            permission    : true,
            loading       : false,
            details       : [],
            details1      : [],
            detail        : null,
            table_head    : [],
            tender        : null,
            isImportExcel : false,
            tables        : []
        };
    },
    mounted () {
        this.loadDetails();
    },
    methods : {
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
                // const average = (initialData[i].averages).toString();
                // alert(typeof average);
                // subDetails[i].push(average);
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
            axios.form(urls.Consumer.Tender.CumulativeAnalysisView, { tender_id : that.tender_id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.tender = json.tender;

                    const tableKeys = ['boq-table', 'boq-wo-qty-table', 'sot-table', 'msp-mnt-table', 'import-excel-table'];
                    that.tables = [];

                    tableKeys.forEach(key => {
                        if (!json[key]) return;

                        // ONLY FOR IMPORT EXCEL
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
                                that.detail = groupItems;
                                that.stripAnalysisDetails();

                                that.tables.push({
                                    type          : 'import-excel-table',
                                    data          : groupItems,
                                    isImportExcel : true,
                                    details       : [...that.details],
                                    details1      : [...that.details1]
                                });
                            });

                            return;
                        }

                        // NORMAL TABLES
                        const tableObj = {
                            type          : key,
                            data          : json[key],
                            isImportExcel : false
                        };

                        that.detail = json[key];
                        that.stripAnalysisDetails();

                        tableObj.details = [...that.details];
                        tableObj.details1 = [...that.details1];

                        that.tables.push(tableObj);
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

                    leftTables.forEach((leftTable, index) => {
                        const rightTable = rightTables[index];
                        if (!rightTable) return;

                        const leftRows = leftTable.querySelectorAll('tbody tr');
                        const rightRows = rightTable.querySelectorAll('tbody tr');

                        leftRows.forEach((leftRow, i) => {
                            const rightRow = rightRows[i];
                            if (!rightRow) return;

                            leftRow.style.height = 'auto';
                            rightRow.style.height = 'auto';

                            const maxHeight = Math.max(
                                leftRow.getBoundingClientRect().height,
                                rightRow.getBoundingClientRect().height
                            );

                            leftRow.style.height = maxHeight + 'px';
                            rightRow.style.height = maxHeight + 'px';

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
};
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
