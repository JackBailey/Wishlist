import pluginVue from "eslint-plugin-vue";

export default [
    ...pluginVue.configs["vue3-strongly-recommended"],
    {
        rules: {
            indent: ["error", 4],
            quotes: ["error", "double"],
            "vue/html-indent": ["error", 4],
            "vue/script-indent": ["error", 4],
            "vue/html-self-closing": [
                "error",
                {
                    html: {
                        void: "always",
                        normal: "never",
                        component: "always"
                    }
                }
            ],
            "vue/max-attributes-per-line": [
                "error",
                {
                    singleline: 3,
                    multiline: {
                        max: 1,
                        allowFirstLine: false
                    }
                }
            ]
        }
    }
];
