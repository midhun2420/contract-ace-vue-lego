<template>
    <div class="bgc-primary h-100 fl-eq c-home">
        <notifications/>
        <div class="content-div">
            <div class="fl-x-cc h-100 pos-r">
                <div class="contents">
                    <a target="_blank" href="https://contractace.com/"
                       style=""
                       class="text-white fs-6 header-text">
                        <div>
                            <img style="height: 12vh; margin-left: -30px;" alt="ContractAce"
                                 src="../../assets/images/CA black 1 (2).png">
                        </div>
                    </a>

                    <div class="form-card">
                        <slot></slot>
                    </div>

                </div>

                <div class="footer-text">BID. BUY. BUILD</div>
            </div>
        </div>
        <div class="img-div">
            <div class="footer-text">
                Hire the <br/><br/><br/> best team
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name          : 'LoginPageLayout',
    titleTemplate : 'ContractAce - %s',
    htmlAttrs     : {
        lang : 'en',
        amp  : true
    }
};

</script>

<style lang="scss">

.round-custom, .round-custom-b::after, .round-custom-b::before, .round-custom-h:hover {
    border-radius: 0;
    border-top-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
    border-bottom-left-radius: 0.2rem;
    border-top-right-radius: 0.2rem;
    border-color: var(--color-secondary-400);
}

.content-div {
    background: url(../../assets/images/Shape2.png) no-repeat top right, url(../../assets/images/Shape1.png) bottom left no-repeat;
    flex-basis: 60%;
    position: relative;

    .contents {
        width: 60%;
    }

    .footer-text {
        position: absolute;
        bottom: 2rem;
        left: 2rem;
        font-size: 4rem;
        color: var(--color-primary-400);
        font-weight: bold;
        text-transform: uppercase;
    }

    .card-head {
        color: var(--color-secondary-400);
        font-weight: 700;
        margin-bottom: 1.5rem;
    }

    .header-text {
        color: white;
        position: absolute;
        top: 2rem;
        font-size: 2rem;
        font-family: 'Roboto Condensed', sans-serif;
    }

}

.img-div {
    border-top-left-radius: 3rem;
    border-bottom-left-radius: 3rem;
    flex-basis: 40%;
    background-position: center center;
    background-image: url(../../assets/images/bg.png);
    background-size: cover;
    position: sticky;
    top: 0;
    height: 100vh;

    .footer-text {
        position: absolute;
        bottom: 2rem;
        left: 2rem;
        font-size: 4rem;
        color: var(--color-primary-400);
        font-weight: bold;
        text-transform: uppercase;
    }
}

.bottom-content-line {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 215px;
}

.top-content-line {
    position: absolute;
    right: -20px;
    width: 180px;
}

.form-card {
    margin-top: 8rem;
    margin-bottom: 8rem;
}

.c-home .h-100 {
    min-height: 100vh;
}

.c-home a {
    text-decoration: none;
    transition: 0.3s;
}

.c-home a:hover {
    color: var(--color-secondary-400);
}

@media screen and (max-width: 768px) {
    .img-div {
        display: none;
    }
    .content-div {
        .top-content-line {
            right: 0
        }

        .contents {
            width: 90%;
        }

        .footer-text {
            max-width: 100%;
            font-size: 2rem;
        }
    }
}

</style>
