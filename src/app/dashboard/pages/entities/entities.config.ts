import { EntityConfig } from "../../../lib/dynamic-forms/core";

export const ENTITIES = {
    ingredients: EntityConfig.fromJson({
        title: "Ingredient",
        fields: [
            {
                key: 'icon_url',
                type: 'image-preview',
                templateOptions: {
                    label: 'Image'
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },
                expressionProperties: {
                    'templateOptions.required': '!model.id',
                },
                list: {
                    parser: 'image',
                    cssStyle: { 'text-align': 'center' },
                    filterable: false,
                }
            },
            {
                key: 'name',
                type: 'input',
                templateOptions: {
                    label: 'Name',
                    required: true,
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },
            },
            {
                key: 'brand',
                type: 'input',
                templateOptions: {
                    label: 'Brand',
                    required: true,
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },

            },
            {
                key: 'price',
                type: 'input',
                templateOptions: {
                    label: 'Price',
                    type: 'number',
                    step: 0.01,
                    required: true,
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },
                list: {
                    parser: 'currency'
                }
            },
            {
                key: 'active',
                type: 'checkbox',
                templateOptions: {
                    label: 'Active',
                },
                list: { parser: 'checkbox' }
            },
        ],
        crudOptions: {
            find: {
                includes: ['ingredients.ingredient']
            }
        },
        listOptions: {
            extraButtons: [{ key: 'importFromCSV', icon: 'cloud-upload' }],
        },
        service: 'IngredientsService',
        object: "Ingredient"
    }),
    categories: EntityConfig.fromJson({
        title: "Category",
        fields: [
            {
                key: 'image_url',
                type: 'image-preview',
                templateOptions: {
                    label: 'Image'
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },
                expressionProperties: {
                    'templateOptions.required': '!model.id',
                },
                list: {
                    parser: 'image',
                    cssStyle: { 'text-align': 'center' },
                    filterable: false,
                }
            },
            {
                key: 'name',
                type: 'input',
                templateOptions: {
                    label: 'Name',
                    required: true,
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },
            },
            {
                key: 'identifier',
                type: 'input',
                templateOptions: {
                    label: 'Identifier',
                    required: true,
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },
            },
            {
                key: 'showBeforeCheckout',
                type: 'checkbox',
                templateOptions: {
                    label: 'Show before checkout',
                },
            },
            {
                key: 'ingredients',
                type: 'many',
                templateOptions: {
                    label: 'Products',
                    service: 'IngredientsService'
                },
                list: {
                    parser: 'count',
                    filterable: false
                }

            },
            {
                key: 'subcategories',
                type: 'many',
                templateOptions: {
                    label: 'Subcategories',
                    service: 'CategoriesService'
                },
                list: {
                    parser: 'count',
                    filterable: false
                },

            },
        ],
        crudOptions: {
            find: {
                includes: ['ingredients', 'subcategories']
            }
        },
        relations: [
            { type: 'many', field: 'ingredients', pk_field: 'id' },
            { type: 'many', field: 'subcategories', pk_field: 'id' },
        ],
        service: 'CategoriesService',
        object: "Category"
    }),
    rims: EntityConfig.fromJson({
        title: "Receipt Ingredients Matching",
        fields: [
            {
                key: 'name',
                type: 'input',
                templateOptions: {
                    label: 'Name',
                    required: true,
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },
            },
            {
                key: 'matchingName',
                type: 'input',
                templateOptions: {
                    label: 'Matching name',
                    required: true,
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },
            },
            {
                key: 'isCondiment',
                type: 'checkbox',
                templateOptions: {
                    label: 'Is condiment',
                },
                list: {
                    parser: 'checkbox'
                }
            },
            {
                key: 'ingredients',
                type: 'ingredients-priority',
                templateOptions: {
                    label: 'Products'
                },
                list: {
                    parser: 'count',
                    filterable: false
                },

            }

        ],
        crudOptions: {
            find: {
                includes: ['ingredients.ingredient']
            }
        },
        relations: [
            { type: 'many', field: 'ingredients', fk_field: 'ingredient', pk_field: 'ingredient.id' }
        ],
        service: 'RimsService',
        object: "ReceiptIngredientsMatching"
    }),
    receipts: EntityConfig.fromJson({
        title: "Receipt",
        fields: [
            {
                key: 'image_url',
                type: 'image-preview',
                templateOptions: {
                    label: 'Image'
                },
                expressionProperties: {
                    'templateOptions.required': '!model.id',
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },
                list: {
                    parser: 'image',
                    cssStyle: { 'text-align': 'center' },
                    filterable: false
                }
            },
            {
                key: 'name',
                type: 'input',
                templateOptions: {
                    label: 'Name',
                    required: true,
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },
            },
            {
                key: 'description',
                type: 'html-editor',
                templateOptions: {
                    label: 'Description',
                    required: true,
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },
                list: {
                    parser: 'ellips:100'
                }

            },
            {
                key: 'preparing',
                type: 'html-editor',
                templateOptions: {
                    label: 'Preparing',
                    required: true,
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },
                list: {
                    parser: 'ellips:100',
                    hidden: true
                }

            },
            {
                key: 'kcal',
                type: 'input',
                templateOptions: {
                    label: 'kcal',
                    required: true,
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                }
            },
            {
                key: 'tags',
                type: 'select',
                templateOptions: {
                    label: 'Tags',
                    multiple: true,
                    required: true,
                    options: [
                        { label: 'Healthy', value: 'healthy' },
                        { label: 'Quick n Easy', value: 'quick-n-easy' },
                        { label: 'Primi', value: 'first' },
                        { label: 'Secondi', value: 'second' },
                        { label: 'Vegatariano', value: 'vegetarian' },
                        { label: 'Gluten free', value: 'gluten-free' },
                        { label: 'No oven', value: 'no-oven' },
                        { label: 'No mixer', value: 'no-mixer' },
                      ]
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },
                list: {
                    
                }
            },
            {
                key: 'time',
                type: 'input',
                templateOptions: {
                    label: 'Time',
                    required: true,
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },
            },
            {
                key: 'ingredients',
                type: 'ingredients-qta',
                templateOptions: {
                    label: 'Ingredienti',
                },
                list: {
                    parser: 'count',
                    filterable: false
                },

            },
        ],
        crudOptions: {
            find: {
                includes: ['ingredients.ingredient']
            }
        },
        relations: [
            { type: 'many', field: 'ingredients', fk_field: 'ingredient', pk_field: 'ingredient.id' }
        ],
        service: 'ReceiptsService',
        object: "Receipt"
    }),
    orders: EntityConfig.fromJson({
        title: "Order",
        fields: [
            {
                key: 'created',
                type: 'input',
                templateOptions: {
                    label: 'Created',
                    type: 'datetime',
                    readOnly: true,
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },
                list: {
                    parser: "date:dd/MM/yyyy HH.mm"
                }
            },
            {
                key: 'status',
                type: 'select',
                templateOptions: {
                    label: 'Status',
                    required: true,
                    options: [
                        { label: "Payment pending", value: "payment_pending" },
                        { label: "Paid", value: "paid" },
                    ]
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },
            },
            {
                key: 'user',
                type: 'one',
                templateOptions: {
                    label: 'User',
                    required: true,
                },
                validation: {
                    messages: {
                        required: "Field is required!",
                    },
                },
            },
        ],
        crudOptions: {
            find: {
                includes: [],
                orderBy: '-created'
            }
        },
        relations: [
            { type: 'one', field: 'user', pk_field: 'ingredient.id' }
        ],
        service: 'OrdersService',
        object: "Order"
    }),
}
