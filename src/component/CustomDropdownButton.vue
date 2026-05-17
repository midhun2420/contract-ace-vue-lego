<template>
    <span class="dropdown">
        <button type="button" v-bind="attrs" class="lego-btn" :class="className" @click="onClicked">
            <slot name="title">
                <i :class="icon" v-if="icon && iconAlignment === 'left'"/>
                <span>{{ text }}</span>
                <i :class="icon" v-if="icon && iconAlignment === 'right'"/>
            </slot>
        </button>
        <AnimateTransition :enter-animation="enterAnimation" :exit-animation="exitAnimation" :duration="duration">
        <span :class="dropdownClassNames" :data-hover="hover" v-if="hover">
            <slot name="default"></slot>
        </span>
        </AnimateTransition>
    </span>
</template>

<script>
import LegoButton from 'lego-framework/src/components/Button';
import AnimateTransition from 'lego-framework/src/components/AnimateTransition';

export default {
    components : { AnimateTransition },
    extends    : LegoButton,
    name       : 'CustomDropdownButton',
    props      : {
        enterAnimation    : { type : String, default : 'flipInX' },
        exitAnimation     : { type : String, default : 'bounceOut' },
        duration          : { type : [String, Number], default : 300 },
        dropDownShadow    : { type : String, default : '11' },
        dropdownAlignment : { type : String, default : 'right' },
        dropdownWidth     : { type : String, default : '10r' }
    },
    data () {
        return { hover : false };
    },
    methods : {
        onClicked () {
            this.hover = true;
        },
        onClickedOutside () {
            if (this.hover !== true) return;
            this.hover = false;
        }

    },
    computed : {
        dropdownClassNames () {
            const names = ['dropdown-menu'];
            if (this.animation) {
                names.push('dd-' + this.animation);
            }

            if (this.dropDownShadow) {
                names.push('bs-' + this.dropDownShadow);
            }

            if (this.dropdownAlignment === 'left') {
                names.push('dropdown-left');
            }

            if (this.dropdownWidth) {
                names.push('w-' + this.dropdownWidth);
            }

            if (this.hover) {
                names.push('visible');
            }
            return names;
        }
    }
};
</script>
