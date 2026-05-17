<template>
    <div class="highlight-box" :style="highlightBox.style">
        <div class="highlight-name">{{ highlightBox.tagName }}</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name : 'highlight-box',
    data () {
        return {
            highlightBox : {
                target  : null,
                tagName : '',
                style   : {}
            }
        };
    },
    computed : {
        ...mapGetters(['editMode'])
    },
    methods : {
        mousemove (e) {
            const targetNode = e.target.closest('[data-element-name]');
            if (this.$el === e.target) {
                // console.log('[Highlight] Mouse Over the highlight element.');
                return;
            }

            if (!targetNode || this.editMode) {
                // console.log('[Highlight] Found null targetNode with e.target:', e.target);

                this.deselect();
                return;
            }

            if (this.highlightBox.target === targetNode) return;

            this.highlightBox.target = targetNode;
            this.highlightBox.tagName = targetNode.getAttribute('data-element-name');

            this.repaintHighlightBox();
        },

        deselect () {
            this.highlightBox = {
                target  : null,
                tagName : '',
                style   : {
                    display : 'none'
                }
            };
        },

        getContainerRect () {
            return this.$parent.$el.getBoundingClientRect();
        },

        repaintHighlightBox () {
            if (!this.highlightBox.target) {
                return;
            }
            this.$nextTick(() => {
                const containerRect = this.getContainerRect();
                const rect = this.highlightBox.target.getBoundingClientRect();

                // console.log("[Highlight]", '[Repaint]', 'Target Rect', rect);
                // console.log("[Highlight]", '[Repaint]', 'Container Rect', containerRect);
                // console.log("[Highlight]", '[Repaint]', 'Container Element', this.$parent.$el);

                const {
                    scrollTop,
                    scrollLeft
                } = this.$parent.$el;
                const top = Math.floor(rect.top - containerRect.top + scrollTop);
                const left = Math.floor(rect.left - containerRect.left + scrollLeft);

                this.highlightBox.style = {
                    display : 'block',
                    width   : `${Math.floor(rect.width)}px`,
                    height  : `${Math.floor(rect.height)}px`,
                    top     : `${top}px`,
                    left    : `${left}px`
                };
            });
        }
    },
    created () {
        this.$Globals.set('highlight', this);
    }
};

</script>
