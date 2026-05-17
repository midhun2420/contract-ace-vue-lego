<template>
    <div>
        <table class="table table-bordered">
            <thead>
            <tr>
                <!-- All columns in original order -->
                <th
                    v-for="(col, i) in activeColumns"
                    :key="'col-' + i"
                    class="text-col">
                    {{ col.label }}
                </th>

                <td v-if="editMode" class="action-col"></td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, i) in block.rows" :key="'row-' + i">
                <!-- All columns in original order -->
                <td v-for="(col, j) in activeColumns" :key="'cell-' + i + '-' + j">
                    <!-- If column is editable or calculated -->
                    <template v-if="col.editable || col.calculate">
                        <validated-input
                            :value="getEditableValue(i, col.key)"
                            @input="handleEditableInput(i, col.key, $event)"
                            :placeholder="col.label"
                            type=""
                            :rules="col.calculate ? {} : numberRules"
                            :disabled="col.calculate"
                            :readonly="col.calculate"
                            :class="{ 'calculated-field': col.calculate }"
                            style="width: 100%; border: none !important; outline: none !important;"/>
                    </template>

                    <!-- If column is static, use ce like BOQ table -->
                    <template v-else>
                        <ce
                            @align="align"
                            tag="span"
                            :value="getStaticValue(i, col.key)"
                            :params="[block.rows[i], getStaticColumnIndex(col.key)]"/>
                    </template>
                </td>

                <!-- Row actions -->
                <td v-if="editMode" class="action-col">
                    <div class="fl-x fl-j-c">
                        <btn size="xs" icon="fa fa-trash" color="danger" class="del-btn" @click="deleteRow(i)"/>
                    </div>
                </td>
            </tr>

            <!-- Add Row button -->
            <tr v-if="editMode">
                <td v-for="(col, i) in activeColumns" :key="'empty-' + i"></td>
                <td class="action-col">
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
            editableData : {},
            numberRules  : {
                numeric   : true,
                min_value : 0
            }
        };
    },

    computed : {
        // Get columns from props or block - maintain original order
        activeColumns () {
            return this.columns && this.columns.length > 0
                ? this.columns
                : (this.block.columns || []);
        }
    },

    mounted () {
        // Ensure columns are set in block if passed as prop
        if (this.columns && this.columns.length > 0 && !this.block.columns) {
            this.$set(this.block, 'columns', this.columns);
        }

        this.initializeEditableData();
        this.initializeIndex();

        // Wait for next tick to ensure columns are loaded
        this.$nextTick(() => {
            this.calculateAllRows();
        });
    },

    methods : {
        // Find column by key
        findColumnByKey (columnKey) {
            if (!this.activeColumns) return null;
            return this.activeColumns.find(col => col.key === columnKey);
        },

        // Get the index in block.rows for a static column
        getStaticColumnIndex (columnKey) {
            const staticColumns = this.activeColumns.filter(col => !col.editable && !col.calculate);
            return staticColumns.findIndex(col => col.key === columnKey);
        },

        // Get static value for a column
        getStaticValue (rowIndex, columnKey) {
            const column = this.findColumnByKey(columnKey);
            if (!column) return '';

            // Find the position of this column in the original data
            const staticIndex = this.getStaticColumnIndex(columnKey);

            if (staticIndex === -1) return '';

            return (this.block.rows[rowIndex] && this.block.rows[rowIndex][staticIndex]) || '';
        },

        // Get value from row by column key (for calculations)
        getValueFromRowByKey (rowIndex, columnKey) {
            const column = this.findColumnByKey(columnKey);

            if (!column) {
                console.warn(`Column "${columnKey}" not found in activeColumns`);
                return null;
            }

            // If it's an editable or calculated column, get from editableData
            if (column.editable || column.calculate) {
                const rawValue = this.getEditableValue(rowIndex, columnKey);
                // If empty or null, return null (not 0)
                if (rawValue === '' || rawValue === null || rawValue === undefined) {
                    return null;
                }
                const value = parseFloat(rawValue);
                return isNaN(value) ? null : value;
            }

            // If it's a static column, get from rows
            const staticIndex = this.getStaticColumnIndex(columnKey);

            if (staticIndex === -1) {
                return null;
            }

            const value = this.block.rows[rowIndex] && this.block.rows[rowIndex][staticIndex];
            const parsedValue = parseFloat(value);
            return isNaN(parsedValue) ? null : parsedValue;
        },

        // Calculate value by multiplying fields
        calculateValue (rowIndex, columnKey) {
            const column = this.findColumnByKey(columnKey);

            if (!column || !column.calculate || !column.calculate_fields || column.calculate_fields.length === 0) {
                return null;
            }

            // Get values for all fields to multiply
            const values = column.calculate_fields.map(fieldKey =>
                this.getValueFromRowByKey(rowIndex, fieldKey)
            );

            // If any value is null (empty field), return 0
            if (values.some(val => val === null)) {
                return 0;
            }

            // Multiply all values together
            const result = values.reduce((acc, val) => acc * val, 1);
            return result;
        },

        // Initialize editable data structure
        initializeEditableData () {
            if (!this.block.editableData) {
                this.$set(this.block, 'editableData', {});
            }
            this.editableData = this.block.editableData;
        },

        // Initialize row index
        initializeIndex () {
            if (!this.block.index) {
                this.$set(this.block, 'index', {});
            }
            // Set index for each row if not already set
            this.block.rows.forEach((row, i) => {
                if (!this.block.index[i]) {
                    this.$set(this.block.index, i, i + 1);
                }
            });
        },

        // Get item number for a row
        getItemNumber (rowIndex) {
            return this.block.index[rowIndex] || rowIndex + 1;
        },

        // Get value for an editable cell
        getEditableValue (rowIndex, columnKey) {
            if (!this.editableData[rowIndex]) {
                this.$set(this.editableData, rowIndex, {});
                this.$set(this.block.editableData, rowIndex, {});
            }
            const value = this.editableData[rowIndex][columnKey];
            return value !== undefined && value !== null ? value : '';
        },

        // Handle input event for editable cells
        handleEditableInput (rowIndex, columnKey, event) {
            // Handle both event objects and direct values
            let value;
            if (event && typeof event === 'object' && event.target) {
                // It's an event object
                value = event.target.value;
            } else {
                // It's a direct value from validated-input component
                value = event;
            }

            // Don't allow manual input for calculated fields
            const column = this.findColumnByKey(columnKey);
            if (column && column.calculate) {
                return;
            }

            // Convert empty, null, or undefined to empty string
            if (value === null || value === undefined) {
                value = '';
            }

            // Update the value first
            this.updateEditableValue(rowIndex, columnKey, value);

            // Force recalculation in next tick to ensure the value is set
            this.$nextTick(() => {
                // Check if any column needs to be calculated based on this field
                if (this.activeColumns && Array.isArray(this.activeColumns)) {
                    this.activeColumns.forEach(col => {
                        // If this column has calculate = true and contains current field in calculate_fields
                        if (col.calculate && col.calculate_fields && col.calculate_fields.includes(columnKey)) {
                            const calculatedValue = this.calculateValue(rowIndex, col.key);
                            // Force update with the calculated value (0 if empty fields)
                            const finalValue = calculatedValue !== null ? calculatedValue : 0;
                            this.updateEditableValue(rowIndex, col.key, finalValue, true);

                            // Force reactivity update
                            this.$forceUpdate();
                        }
                    });
                }

                // Trigger update after all calculations
                this.update();
            });
        },

        // Update value for an editable cell
        updateEditableValue (rowIndex, columnKey, value, skipUpdate = false) {
            if (!this.editableData[rowIndex]) {
                this.$set(this.editableData, rowIndex, {});
            }

            // Force Vue to recognize the change
            this.$set(this.editableData[rowIndex], columnKey, value);

            // Also update block.editableData directly
            if (!this.block.editableData) {
                this.$set(this.block, 'editableData', {});
            }
            if (!this.block.editableData[rowIndex]) {
                this.$set(this.block.editableData, rowIndex, {});
            }
            this.$set(this.block.editableData[rowIndex], columnKey, value);

            // Trigger update
            if (!skipUpdate) {
                this.update();
            }
        },

        // Add a new row
        addRow () {
            // Create empty row based on static columns count
            const staticColumns = this.activeColumns.filter(col => !col.editable && !col.calculate);
            const newRow = new Array(staticColumns.length).fill('');
            this.block.rows.push(newRow);

            // Update index for the new row
            const newIndex = this.block.rows.length;
            this.$set(this.block.index, this.block.rows.length - 1, newIndex);

            // Initialize editable data for the new row
            const rowIndex = this.block.rows.length - 1;
            this.$set(this.editableData, rowIndex, {});
            this.$set(this.block.editableData, rowIndex, {});

            // Initialize all editable and calculated columns for new row
            this.activeColumns.forEach(col => {
                if (col.editable || col.calculate) {
                    this.updateEditableValue(rowIndex, col.key, '', true);
                }
            });

            this.update();
        },

        // Delete a row
        deleteRow (index) {
            if (this.block.rows.length <= 1) {
                alert('Cannot delete the last row');
                return;
            }

            // Remove the row
            this.block.rows.splice(index, 1);

            // Remove editable data for this row
            if (this.editableData[index]) {
                this.$delete(this.editableData, index);
            }

            // Rebuild index and editable data with new indices
            this.reindexAfterDelete(index);
            this.update();
        },

        // Reindex after deletion
        reindexAfterDelete (deletedIndex) {
            const newIndex = {};
            const newEditableData = {};

            this.block.rows.forEach((row, i) => {
                newIndex[i] = i + 1;
                if (this.editableData[i < deletedIndex ? i : i + 1]) {
                    newEditableData[i] = this.editableData[i < deletedIndex ? i : i + 1];
                }
            });

            this.$set(this.block, 'index', newIndex);
            this.editableData = newEditableData;
            this.$set(this.block, 'editableData', newEditableData);
        },

        // Calculate all rows on mount (for existing data)
        calculateAllRows () {
            if (!this.activeColumns || !Array.isArray(this.activeColumns)) {
                console.warn('No active columns found for calculation');
                return;
            }

            this.block.rows.forEach((row, rowIndex) => {
                this.activeColumns.forEach(col => {
                    if (col.calculate && col.calculate_fields && col.calculate_fields.length > 0) {
                        const calculatedValue = this.calculateValue(rowIndex, col.key);
                        if (calculatedValue !== null) {
                            this.updateEditableValue(rowIndex, col.key, calculatedValue, true);
                        }
                    }
                });
            });

            // Trigger one update after all calculations
            this.$nextTick(() => {
                this.update();
            });
        },

        // Update method - triggers parent update if available
        update () {
            // Check if parent has update method
            if (this.$parent && typeof this.$parent.update === 'function') {
                this.$parent.update();
            } else if (this.$parent && this.$parent.$parent && typeof this.$parent.$parent.update === 'function') {
                this.$parent.$parent.update();
            } else {
                // Emit event as fallback
                this.$emit('update', this.block);
            }
        }
    },

    watch : {
        'block.columns' : {
            handler () {
                this.initializeEditableData();
                this.calculateAllRows();
            },
            deep : true
        },

        columns : {
            handler () {
                this.initializeEditableData();
                this.calculateAllRows();
            },
            deep : true
        }
    }
};
</script>

<style scoped>
.text-col {
    min-width: 100px;
}

.action-col {
    width: 50px;
    min-width: 50px;
    max-width: 50px;
    padding: 0.5rem !important;
}

.btn-group-tight1 {
    display: flex;
    gap: 2px;
}

.form-control {
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
}

.calculated-field {
    background-color: #f0f0f0 !important;
    cursor: not-allowed !important;
}

:deep(.del-btn) {
    padding: 7px !important;
}

:deep(.validated-input),
:deep(.validated-input input),
:deep(.validated-input .form-control) {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
}

:deep(.validated-input input:focus),
:deep(.validated-input .form-control:focus) {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
}
</style>
