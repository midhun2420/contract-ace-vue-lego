import BaseComponent from '@/component/Editor/BaseComponent';
import ContentEditable from '@/component/ContentEditable/ContentEditable';

export default {
    extends    : BaseComponent,
    components : { ce : ContentEditable },

    beforeMount () {
        const block = this.block;
        const rows = block.rows;
        const first = rows[0];
        if (typeof first === 'string') {
            const newRows = [];
            const l = rows.length;
            let i;
            for (i = 0; i < l; i += 1) {
                newRows.push({
                    level  : 0,
                    text   : rows[i],
                    index  : i + 1,
                    prefix : ''
                });
            }
            block.rows = newRows;
        }
    },

    methods : {
        addRow () {
            const block = this.block;
            const rows = block.rows;
            const last = rows[rows.length - 1];
            const level = last ? last.level : 0;
            rows.push({
                text   : 'Item',
                level  : level,
                index  : 0,
                prefix : ''
            });
            this.updateIndexes();
        },

        moveRowUp (index) {
            if (index === 0) {
                return;
            }
            const block = this.block;
            const rows = block.rows;
            const row = rows.splice(index, 1)[0];
            rows.splice(index - 1, 0, row);
            this.updateIndexes();
        },

        moveRowDown (index) {
            const block = this.block;
            const rows = block.rows;
            if (index === rows.length - 1) {
                return;
            }
            const row = rows.splice(index, 1)[0];
            rows.splice(index + 1, 0, row);
            this.updateIndexes();
        },

        deleteRow (index) {
            const block = this.block;
            const rows = block.rows;
            rows.splice(index, 1);
            this.updateIndexes();
        },

        increaseLevel (i) {
            if (i === 0) {
                alert('Cant increase first item.');
                return;
            }
            const block = this.block;
            const rows = block.rows;
            const row = rows[i];
            const pRow = rows[i - 1];
            const newLevel = row.level + 1;
            if (newLevel - pRow.level < 2) {
                row.level += 1;
                this.updateIndexes();
            } else {
                alert('Cant increase.');
            }
        },

        decreaseLevel (i) {
            const block = this.block;
            const rows = block.rows;
            const row = rows[i];
            if (row.level < 1) {
                alert('Cant decrease.');
                return;
            }
            row.level -= 1;
            this.updateIndexes();
        },

        updateIndexes () {
            const block = this.block;
            const rows = block.rows;
            const newRows = [];
            const l = rows.length;

            let currentItem;
            let currentLevel = 0;
            let currentIndex = 0;
            let currentPrefix = '';

            let previousItem;
            let previousRow;

            let i;
            for (i = 0; i < l; i += 1) {
                currentItem = rows[i];
                currentLevel = currentItem.level;
                console.log('[update-index]', '[current-item-level]', currentLevel);
                if (previousRow) {
                    console.log('[update-index]', '[previous-row-level]', previousRow.level);
                    if (currentLevel > previousRow.level) {
                        console.log('[update-index]', '[corrected level]');
                        currentLevel = previousRow.level + 1;
                    }
                }
                previousItem = this.lastItemWithLevel(newRows, currentLevel);
                if (i === 0) {
                    currentLevel = 0;
                }
                if (previousItem) {
                    currentIndex = previousItem.index + 1;
                    currentPrefix = previousItem.prefix;
                } else {
                    currentIndex = 1;
                    if (previousRow && previousRow.level === currentLevel - 1) {
                        if (previousRow.prefix) {
                            currentPrefix = previousRow.prefix + '.' + previousRow.index;
                        } else {
                            currentPrefix = previousRow.index;
                        }
                    } else {
                        currentPrefix = '';
                    }
                }

                const newRow = {
                    text   : currentItem.text,
                    level  : currentLevel,
                    prefix : currentPrefix,
                    index  : currentIndex
                };

                console.log('[update-index]', '[new-row]', JSON.stringify(newRow, null, 4));
                console.log('[update-index]', '[previous-item]', JSON.stringify(previousItem, null, 4));
                console.log('[update-index]', '[previous-row]', JSON.stringify(previousRow, null, 4));
                console.log('[update-index]', '------------------------------');
                newRows.push(newRow);

                previousRow = currentItem;
            }
            block.rows = newRows;
        },

        lastItemWithLevel (rows, level) {
            console.log('[update-index]', '[last-item-with-level]', '[level]', level);

            let l = rows.length;
            let row;
            while (l > 0) {
                console.log('[update-index]', '[last-item-with-level]', 'l', l);
                l -= 1;
                row = rows[l];
                if (row.level < level) {
                    console.log('[update-index]', '[last-item-with-level]', 'level-less');
                    return;
                }
                if (row.level === level) {
                    console.log('[update-index]', '[last-item-with-level]', 'found-level');
                    return row;
                }
            }
            console.log('[update-index]', '[last-item-with-level]', 'rows', JSON.stringify(rows, null, 2));
            console.log('[update-index]', '[last-item-with-level]', 'not found');
        }
    }
};
