<template>
    <div class="col-lg-12 card">
        <div class="">
            <div>
                <div class="col-12 ">
                    <div class="row">
                        <div class="col-lg-6">
                            <div><h3 class=" fs-6 mb-4 ml-1 mt-2">Company</h3>
                            </div>
                            <div class="col-4 col-lg-6 col-md  px-1">
                                <validated-input class=" " placeholder="Search">
                                    <template #append>
                                        <i class="fa fa-search"></i>
                                    </template>
                                </validated-input>
                            </div>
                        </div>
                        <div class="col-lg-6 fl-x-br fl-a-s">
                            <btn text="add" color="success" icon="fa fa-plus" class="px-3"></btn>
                        </div>
                    </div>

                </div>
            </div>
            <div class="col-lg-12  p-0">
                <div class="row">
                    <div class="col-lg-2 py-6 pl-4 pr-3">
                        <div class=" row p-0 ">
                            <div class="col-lg-6  col-7">

                                <p class="txt-clr-custom-2 font-weight-bold">Filters</p>

                            </div>
                            <div class="col-lg-6 col-5 fl-x-br ">
                                <p class=" red font-weight-bold">Clear All</p>

                            </div>
                        </div>
                        <div class="">
                            <label class="label-fs font-weight-bold">Country</label>
                            <validated-select class="c-input-select"></validated-select>
                        </div>
                        <div class="">
                            <label class="label-fs font-weight-bold">State</label>
                            <validated-select class="c-input-select"></validated-select>
                        </div>
                        <div class="p-0">
                            <label class="label-fs font-weight-bold">District</label>
                            <validated-select class="c-input-select"></validated-select>
                        </div>
                        <div class="p-0">
                            <label class="label-fs font-weight-bold">Vendor Category</label>
                            <validated-select class="c-input-select"></validated-select>
                        </div>
                    </div>

                    <div class="col-lg-10 row py-6  ">
                        <div class="row ml-4">
                            <div class="col mr-3 w-20r bs-custom bs-4 ">
                                <div class="fl-x-br mt-3">
                                    <img src="../assets/images/icons/ic_round-delete.png" class="mr-2">
                                    <img src="../assets/images/icons/ic_baseline-remove-red-eye.png" class="mr-2">
                                    <btn text="suspend" class="gl" size="xs"></btn>
                                </div>
                                <div class="fl-x-cc mt-5">
                                    <img src="../assets/images/Logos/Xeoscript.png">
                                </div>
                                <p class="text-center mt-4 font-weight-bold fs--1 txt-clr-custom">Xeoscript Technologies<br>656687687
                                </p>
                                <div class="fl-x-tl mt-3 mb-0">
                                    <img src="../assets/images/icons/material-symbols_phone-enabled-sharp.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text mb-0">666437467438</p>
                                </div>
                                <div class="fl-x-tl mt-0">
                                    <img src="../assets/images/icons/material-symbols_mail-rounded.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text">666437467438</p>
                                </div>
                            </div>
                            <div class="col mr-3 w-20r p-3 bs-custom bs-4 ">
                                <div class="fl-x-br ">
                                    <img src="../assets/images/icons/ic_round-delete.png" class="mr-2">
                                    <img src="../assets/images/icons/ic_baseline-remove-red-eye.png" class="mr-2">
                                    <btn text="suspend" class="gl" size="xs"></btn>
                                </div>
                                <div class="fl-x-cc mt-5">
                                    <img src="../assets/images/Logos/sc.png">
                                </div>
                                <p class="text-center mt-4 font-weight-bold fs--1 txt-clr-custom">Xeoscript Technologies<br>656687687
                                </p>
                                <div class="fl-x-tl mt-4 mb-0">
                                    <img src="../assets/images/icons/material-symbols_phone-enabled-sharp.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text mb-0">666437467438</p>
                                </div>
                                <div class="fl-x-tl mt-0">
                                    <img src="../assets/images/icons/material-symbols_mail-rounded.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text">666437467438</p>
                                </div>
                            </div>
                            <div class="col mr-3 w-20r bs-custom bs-4 ">
                                <div class="fl-x-br mt-3">
                                    <img src="../assets/images/icons/ic_round-delete.png" class="mr-2">
                                    <img src="../assets/images/icons/ic_baseline-remove-red-eye.png" class="mr-2">
                                    <btn text="suspend" class="gl" size="xs"></btn>
                                </div>
                                <div class="fl-x-cc mt-5">
                                    <img src="../assets/images/Logos/dubai.png">
                                </div>
                                <p class="text-center mt-4 font-weight-bold fs--1 txt-clr-custom">Xeoscript Technologies<br>656687687
                                </p>
                                <div class="fl-x-tl mt-4 mb-0">
                                    <img src="../assets/images/icons/material-symbols_phone-enabled-sharp.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text mb-0">666437467438</p>
                                </div>
                                <div class="fl-x-tl mt-0">
                                    <img src="../assets/images/icons/material-symbols_mail-rounded.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text">666437467438</p>
                                </div>
                            </div>
                            <div class="col mr-3 w-20r bs-custom bs-4 ">
                                <div class="fl-x-br mt-3">
                                    <img src="../assets/images/icons/ic_round-delete.png" class="mr-2">
                                    <img src="../assets/images/icons/ic_baseline-remove-red-eye.png" class="mr-2">
                                    <btn text="suspend" class="gl" size="xs"></btn>
                                </div>
                                <div class="fl-x-cc mt-5">
                                    <img src="../assets/images/Logos/catec.png">
                                </div>
                                <p class="text-center mt-5 font-weight-bold fs--1 txt-clr-custom">Xeoscript Technologies<br>656687687
                                </p>
                                <div class="fl-x-tl mt-4 mb-0">
                                    <img src="../assets/images/icons/material-symbols_phone-enabled-sharp.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text mb-0">666437467438</p>
                                </div>
                                <div class="fl-x-tl mt-0">
                                    <img src="../assets/images/icons/material-symbols_mail-rounded.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text">666437467438</p>
                                </div>
                            </div>
                            <div class="col mr-3 w-20r bs-custom bs-4 ">
                                <div class="fl-x-br mt-3">
                                    <img src="../assets/images/icons/ic_round-delete.png" class="mr-2">
                                    <img src="../assets/images/icons/ic_baseline-remove-red-eye.png" class="mr-2">
                                    <btn text="suspend" class="gl" size="xs"></btn>
                                </div>
                                <div class="fl-x-cc mt-5 zsm">
                                    <img src="../assets/images/Logos/zenith.png" class="zsm">
                                </div>
                                <p class="text-center mt-5 font-weight-bold fs--1 txt-clr-custom ">Zenith
                                    SmartContracting<br>656687687
                                </p>
                                <div class="fl-x-tl mt-4 mb-0">
                                    <img src="../assets/images/icons/material-symbols_phone-enabled-sharp.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text mb-0">666437467438</p>
                                </div>
                                <div class="fl-x-tl mt-0">
                                    <img src="../assets/images/icons/material-symbols_mail-rounded.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text">666437467438</p>
                                </div>
                            </div>

                        </div>
                        <div class="row ml-3 mt-5">
                            <div class="col mr-3 w-20r bs-custom bs-4 ">
                                <div class="fl-x-br mt-3">
                                    <img src="../assets/images/icons/ic_round-delete.png" class="mr-2">
                                    <img src="../assets/images/icons/ic_baseline-remove-red-eye.png" class="mr-2">
                                    <btn class="gl" text="suspend" size="xs"></btn>
                                </div>
                                <div class="fl-x-cc mt-5">
                                    <img src="../assets/images/Logos/Xeoscript.png">
                                </div>
                                <p class="text-center mt-4 font-weight-bold fs--1 txt-clr-custom">Xeoscript Technologies<br>656687687
                                </p>
                                <div class="fl-x-tl mt-3 mb-0">
                                    <img src="../assets/images/icons/material-symbols_phone-enabled-sharp.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text mb-0">666437467438</p>
                                </div>
                                <div class="fl-x-tl mt-0">
                                    <img src="../assets/images/icons/material-symbols_mail-rounded.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text">666437467438</p>
                                </div>
                            </div>
                            <div class="col mr-3 w-20r p-3 bs-custom bs-4 ">
                                <div class="fl-x-br ">
                                    <img src="../assets/images/icons/ic_round-delete.png" class="mr-2">
                                    <img src="../assets/images/icons/ic_baseline-remove-red-eye.png" class="mr-2">
                                    <btn text="suspend" class="gl" size="xs"></btn>
                                </div>
                                <div class="fl-x-cc mt-5">
                                    <img src="../assets/images/Logos/sc.png">
                                </div>
                                <p class="text-center mt-4 font-weight-bold fs--1 txt-clr-custom">Xeoscript Technologies<br>656687687
                                </p>
                                <div class="fl-x-tl mt-4 mb-0">
                                    <img src="../assets/images/icons/material-symbols_phone-enabled-sharp.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text mb-0">666437467438</p>
                                </div>
                                <div class="fl-x-tl mt-0">
                                    <img src="../assets/images/icons/material-symbols_mail-rounded.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text">666437467438</p>
                                </div>
                            </div>
                            <div class="col mr-3 w-20r bs-custom bs-4 ">
                                <div class="fl-x-br mt-3">
                                    <img src="../assets/images/icons/ic_round-delete.png" class="mr-2">
                                    <img src="../assets/images/icons/ic_baseline-remove-red-eye.png" class="mr-2">
                                    <btn text="suspend" class="gl" size="xs"></btn>
                                </div>
                                <div class="fl-x-cc mt-5">
                                    <img src="../assets/images/Logos/dubai.png">
                                </div>
                                <p class="text-center mt-4 font-weight-bold fs--1 txt-clr-custom">Xeoscript Technologies<br>656687687
                                </p>
                                <div class="fl-x-tl mt-4 mb-0">
                                    <img src="../assets/images/icons/material-symbols_phone-enabled-sharp.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text mb-0">666437467438</p>
                                </div>
                                <div class="fl-x-tl mt-0">
                                    <img src="../assets/images/icons/material-symbols_mail-rounded.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text">666437467438</p>
                                </div>
                            </div>
                            <div class="col mr-3 w-20r bs-custom bs-4 ">
                                <div class="fl-x-br mt-3">
                                    <img src="../assets/images/icons/ic_round-delete.png" class="mr-2">
                                    <img src="../assets/images/icons/ic_baseline-remove-red-eye.png" class="mr-2">
                                    <btn text="suspend" class="gl" size="xs"></btn>
                                </div>
                                <div class="fl-x-cc mt-5">
                                    <img src="../assets/images/Logos/catec.png">
                                </div>
                                <p class="text-center mt-5 font-weight-bold fs--1 txt-clr-custom">Xeoscript Technologies<br>656687687
                                </p>
                                <div class="fl-x-tl mt-4 mb-0">
                                    <img src="../assets/images/icons/material-symbols_phone-enabled-sharp.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text mb-0">666437467438</p>
                                </div>
                                <div class="fl-x-tl mt-0">
                                    <img src="../assets/images/icons/material-symbols_mail-rounded.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text">666437467438</p>
                                </div>
                            </div>
                            <div class="col mr-3 w-20r bs-custom bs-4 ">
                                <div class="fl-x-br mt-3">
                                    <img src="../assets/images/icons/ic_round-delete.png" class="mr-2">
                                    <img src="../assets/images/icons/ic_baseline-remove-red-eye.png" class="mr-2">
                                    <btn text="suspend" class="gl" size="xs"></btn>
                                </div>
                                <div class="fl-x-cc mt-5 zsm">
                                    <img src="../assets/images/Logos/zenith.png" class="zsm">
                                </div>
                                <p class="text-center mt-5 font-weight-bold fs--1 txt-clr-custom ">Zenith
                                    SmartContracting<br>656687687
                                </p>
                                <div class="fl-x-tl mt-4 mb-0">
                                    <img src="../assets/images/icons/material-symbols_phone-enabled-sharp.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text mb-0">666437467438</p>
                                </div>
                                <div class="fl-x-tl mt-0">
                                    <img src="../assets/images/icons/material-symbols_mail-rounded.png"
                                         class="mr-2 mt-1">
                                    <p class="ic-text">666437467438</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name : 'Company'
};
</script>

<style scoped lang="scss">
.bs-custom {
    background-color: #f6fbff;
}

.label-fs {
    font-size: 11px;
    color: #284565;

}

.txt-clr-custom {
    color: #284565;
    font-size: 11px;

}

.txt-clr-custom-1 {
    color: #284565;

}

.txt-clr-custom-2 {
    color: #284565;
    font-size: 13px;

}

.red {
    color: red;
    font-size: 12px;
}

.ic-text {
    font-size: 11px;
    color: #284565;
}

.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}

.item {
    padding: 3rem;
    border: #ccc 1px solid;
    background: #f4f4f4;
    font-size: 1.3rem;
    font-weight: bold;
    text-align: center;
}

.item:first-child {
    grid-column-start: 1;
    grid-column-end: 5;
}

.zsm img {
    height: 53px;
    width: 100px;
}
.xeo img{
    height: 82px;
    width: 100px;
}

.c-input-select {
    .form-control {
        position: relative;
        padding: var(--spacer-1) var(--spacer-2) !important;

        input {
            //font-family: 'inter-bold';
            //font-size: 0.8rem;
            padding: var(--spacer-1) var(--spacer-2) !important;
            color: var(--color-white) !important;
        }

        .form-check > .control:focus-visible, .form-control > .control:focus-visible {
            color: white;
        }

        .vs__open-indicator {
            display: none !important;
        }

        .vs__actions {
            display: none !important;
        }

        &:after {
            content: '';
            position: absolute;
            right: var(--spacer-3);
            top: 50%;
            transform: translateY(-50%) !important;
            width: 16px;
            height: 16px;
            background: url("../assets/images/icons/material-symbols_arrow-forward-ios-rounded.png");
            transform: rotate(90deg);
        }
    }
}
</style>
