import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

export default [
    { files: ["**/*.{js,mjs,cjs,vue}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...pluginVue.configs["flat/essential"],
    {
        globals: {
            process: "readonly"
        },
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
                    singleline: {
                        max: 2
                    },
                    multiline: {
                        max: 1
                    }
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
                    ignore: ["md-icon"]
                }
            ],
            "vue/first-attribute-linebreak": [
                "error",
                {
                    multiline: "below",
                    singleline: "ignore"
                }
            ],
            "vue/html-closing-bracket-newline": [
                "error",
                {
                    singleline: "never",
                    multiline: "always",
                    selfClosingTag: {
                        singleline: "never",
                        multiline: "always"
                    }
                }
            ],
            semi: ["error", "always"],
            "comma-dangle": ["error", "never"],
            "object-curly-spacing": ["error", "always"],
            "array-bracket-spacing": ["error", "never"]
        }
    }
];
