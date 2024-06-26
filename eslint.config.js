import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

export default [
    { files: ["**/*.{js,mjs,cjs,vue}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...pluginVue.configs["flat/essential"],
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
                    multiline: 1
                }
            ],
            "sort-imports": [
                "error",
                {
                    memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
                    allowSeparatedGroups: true,
                    ignoreCase: true
                }
            ],
            "vue/no-deprecated-slot-attribute": [
                "error",
                {
                    ignore: "md-icon"
                }
            ]
        }
    }
];
