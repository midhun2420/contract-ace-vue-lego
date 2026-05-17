<template>
    <div>
        <table class="table table-bordered">
            <thead>
            <tr>
                <!-- All columns in original order -->
                <th
                    v-for="(col, i) in activeColumns"
                    :key="'col-' + i"
                    class="text-col text-center">
                    {{ col.label }}
                </th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(row, i) in block.rows" :key="'row-' + i">
                <!-- All columns in original order -->
                <td v-for="(col, j) in activeColumns" :key="'cell-' + i + '-' + j">

                    <!-- calculated -->
                    <span v-if="col.calculate" class="calculated-value">
                        {{ getCalculatedValue(i, col.key) }}
                    </span>

                    <!-- editable & not view only -->
                    <validated-input
    v-else-if="col.editable && !viewOnly"
    :value="getEditableValue(i, col.key)"
    @input="handleEditableInput(i, col.key, $event)"
    @keydown.up.prevent
    @keydown.down.prevent
    @wheel.prevent
    :placeholder="col.label"
    type=""
    :rules="numberRules"
    inputmode="decimal"
    class="form-control editable-input no-spinner"
    style="border: none; width: 100%"
/>

                    <!-- editable but view only -->
                    <span v-else-if="col.editable && viewOnly">
                        {{ getEditableValue(i, col.key) || '-' }}
                    </span>

                    <!-- static -->
                    <span v-else>
                        {{ getStaticValue(i, col.key) }}
                    </span>

                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import TableCommons from '@/component/Bidder/BaseComponent';

export default {
    name    : 'editor-import-excel',
    extends : TableCommons,

    props : {
        columns : {
            type    : Array,
            default : () => []
        }
    },

    data () {
        return {
            numberRules : {
                numeric   : true,
                min_value : 0
            }
        };
    },

    computed : {
        activeColumns () {
            return this.block.prop?.columns || this.block.columns || [];
        }
    },

    mounted () {
        this.$nextTick(() => {
            this.calculateAllRows();
        });
    },

    methods : {
        findColumnByKey (columnKey) {
            if (!this.activeColumns) return null;
            return this.activeColumns.find(col => col.key === columnKey);
        },

        getStaticValue (rowIndex, columnKey) {
            const column = this.findColumnByKey(columnKey);
            if (!column) return '';

            const staticColumns = this.activeColumns.filter(col => !col.editable && !col.calculate);
            const staticIndex = staticColumns.findIndex(col => col.key === columnKey);

            if (staticIndex === -1) return '';
            return this.block.rows[rowIndex]?.[staticIndex] || '';
        },

        getEditableValue (rowIndex, columnKey) {
            const key = `${rowIndex}_${columnKey}`;
            return this.getValue(key, undefined) || '';
        },

        getCalculatedValue (rowIndex, columnKey) {
            const calculated = this.calculateValue(rowIndex, columnKey);
            return calculated !== null ? calculated : 0;
        },

        getValueFromRowByKey (rowIndex, columnKey) {
            const column = this.findColumnByKey(columnKey);
            if (!column) return null;

            if (column.editable || column.calculate) {
                const rawValue = this.getEditableValue(rowIndex, columnKey);
                if (rawValue === '' || rawValue === null || rawValue === undefined) return null;

                const value = parseFloat(rawValue);
                return isNaN(value) ? null : value;
            }

            const staticColumns = this.activeColumns.filter(col => !col.editable && !col.calculate);
            const staticIndex = staticColumns.findIndex(col => col.key === columnKey);
            if (staticIndex === -1) return null;

            const value = this.block.rows[rowIndex]?.[staticIndex];
            const parsed = parseFloat(value);
            return isNaN(parsed) ? null : parsed;
        },

        calculateValue (rowIndex, columnKey) {
            const column = this.findColumnByKey(columnKey);
            if (!column || !column.calculate || !column.calculate_fields?.length) return null;

            const values = column.calculate_fields.map(key =>
                this.getValueFromRowByKey(rowIndex, key)
            );

            if (values.some(v => v === null)) return 0;
            return values.reduce((a, b) => a * b, 1);
        },

        handleEditableInput (rowIndex, columnKey, event) {
            let value = event?.target ? event.target.value : event;
            if (value === null || value === undefined) value = '';

            this.updateEditableValue(rowIndex, columnKey, value);

            this.$nextTick(() => {
                this.recalculateDependentFields(rowIndex, columnKey);
                this.$forceUpdate();
            });
        },

        updateEditableValue (rowIndex, columnKey, value) {
            const key = `${rowIndex}_${columnKey}`;
            this.input(value, key, undefined);
        },

        recalculateDependentFields (rowIndex, changedKey) {
            if (!Array.isArray(this.activeColumns)) return;

            this.activeColumns.forEach(col => {
                if (col.calculate && col.calculate_fields?.includes(changedKey)) {
                    const val = this.calculateValue(rowIndex, col.key) ?? 0;
                    this.updateEditableValue(rowIndex, col.key, val);
                }
            });
        },

        calculateAllRows () {
            if (!Array.isArray(this.activeColumns)) return;

            this.block.rows.forEach((row, rowIndex) => {
                this.activeColumns.forEach(col => {
                    if (col.calculate && col.calculate_fields?.length) {
                        const val = this.calculateValue(rowIndex, col.key);
                        if (val !== null) {
                            this.updateEditableValue(rowIndex, col.key, val);
                        }
                    }
                });
            });

            this.$forceUpdate();
        }
    }
};
</script>

<style scoped>
.text-col {
    min-width: 10px;
}

.form-control {
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
}

.calculated-value {
    font-weight: 500;
    color: #2c3e50;
}

.editable-input {
    background-color: #f8f9fa;
}

/* 🔧 FORCE REMOVE NUMBER SPINNER (validated-input internal) */
:deep(.no-spinner input[type="number"]) {
    -moz-appearance: textfield;
    appearance: textfield;
}

:deep(.no-spinner input[type="number"]::-webkit-inner-spin-button),
:deep(.no-spinner input[type="number"]::-webkit-outer-spin-button) {
    -webkit-appearance: none;
    margin: 0;
}

/* 🔧 sometimes browser renders spinbutton role */
:deep(.no-spinner input[role="spinbutton"]) {
    appearance: none;
}
:deep(.form-control.editable-input) {
    display: block;
    font-size: 0.7rem;
    gap: 4px;
}
</style>
