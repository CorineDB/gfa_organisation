<template>
    
</template>

<script>

export default {
    props: ["template", "champs", "cols", "submitText", "isAllPairSaufDescrip", "attrs"],
    components: {
        
    },
    datas() {
        return {};
    },
    methods: {
        save() {
            this.$emit("sendForm");
        },
    },
    computed: {
        Inputs() {
            let datas = [];
            if (this.champs != undefined || this.champs != null) {
                this.champs.forEach((element) => {
                    if (element.isSelect === false && element.isTextArea === false) {
                        datas.push(element);
                    }
                });
            }

            return datas;
        },
        Selects() {
            let datas = [];
            if (this.champs != undefined || this.champs != null) {
                this.champs.forEach((element) => {
                    if (element.isSelect === true && element.isTextArea === false) {
                        datas.push(element);
                    }
                });
            }
            return datas;
        },
        TextArea() {
            let datas = [];
            if (this.champs != undefined || this.champs != null) {
                this.champs.forEach((element) => {
                    if (element.isTextArea === true && element.isSelect === false) {
                        datas.push(element);
                    }
                });
            }
            return datas;
        },
    },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style></style>
