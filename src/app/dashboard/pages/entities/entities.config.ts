import { EntityConfig } from '../../../lib/dynamic-forms/core/entity.config';

export const ENTITIES = {
  ingredients: EntityConfig.fromJson({
    title: 'Ingredients',
    fields: [
      {
        key: 'icon_url',
        type: 'image-preview',
        templateOptions: {
          label: 'Image',
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        expressionProperties: {
          'templateOptions.required': '!model.id',
        },
        list: {
          parser: 'image',
          cssStyle: { 'text-align': 'center' },
          filterable: false,
        },
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
            required: 'Field is required!',
          },
        },
        list: {
          filter_type: 'text',
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
            required: 'Field is required!',
          },
        },
        list: {
          filter_type: 'text',
        },
      },
      {
        key: 'qty',
        type: 'input',
        templateOptions: {
          label: 'Q.ty',
          required: true,
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        list: {
          filter_type: 'text',
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
            required: 'Field is required!',
          },
        },
        list: {
          parser: 'currency',
          filter_type: 'range',
        },
      },
      {
        key: 'active',
        type: 'checkbox',
        templateOptions: {
          label: 'Active',
        },
        list: {
          parser: 'checkbox',
          filter_type: 'checkbox',
        },
      },
    ],
    crudOptions: {
      find: {
        includes: ['ingredients.ingredient'],
      },
    },
    listOptions: {
      extraButtons: [{ key: 'importFromCSV', icon: 'cloud-upload' }],
    },
    service: 'IngredientsService',
    object: 'Ingredient',
  }),
  categories: EntityConfig.fromJson({
    title: 'Categories',
    fields: [
      {
        key: 'image_url',
        type: 'image-preview',
        templateOptions: {
          label: 'Image',
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        expressionProperties: {
          'templateOptions.required': '!model.id',
        },
        list: {
          parser: 'image',
          cssStyle: { 'text-align': 'center' },
          filterable: false,
        },
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
            required: 'Field is required!',
          },
        },
        list: {
          filter_type: 'text',
          filterable: true,
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
            required: 'Field is required!',
          },
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
      {
        key: 'showInShop',
        type: 'checkbox',
        templateOptions: {
          label: 'Show category in shop',
        },
        list: {
          parser: 'checkbox',
          filter_type: 'checkbox',
          filterable: true,
        },
      },
      {
        key: 'showBeforeCheckout',
        type: 'checkbox',
        templateOptions: {
          label: 'Show before checkout',
        },
        list: {
          parser: 'checkbox',
          filter_type: 'checkbox',
          filterable: true,
        },
      },
      {
        key: 'ingredients',
        type: 'many',
        templateOptions: {
          label: 'Products',
          service: 'IngredientsService',
          selected_key: "item.name + ' - ' + item.brand + ' - ' + item.qty",
        },
        list: {
          parser: 'count',
          filter_type: 'range',
          filterable: false,
        },
      },
      {
        key: 'subcategories',
        type: 'many',
        templateOptions: {
          label: 'Subcategories',
          service: 'CategoriesService',
        },
        list: {
          parser: 'count',
          filterable: false,
        },
      },
    ],
    crudOptions: {
      find: {
        includes: [],
      },
      findOne: {
        includes: ['ingredients', 'subcategories'],
      },
    },
    relations: [
      { type: 'many', field: 'ingredients', pk_field: 'id' },
      { type: 'many', field: 'subcategories', pk_field: 'id' },
    ],
    service: 'CategoriesService',
    object: 'Category',
  }),
  rims: EntityConfig.fromJson({
    title: 'Recipes Ingredients Matching (RIMS)',
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
            required: 'Field is required!',
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
            required: 'Field is required!',
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
          parser: 'checkbox',
          filter_type: 'checkbox',
        },
      },
      {
        key: 'ingredients',
        type: 'ingredients-priority',
        templateOptions: {
          label: 'Products',
        },
        list: {
          parser: 'count',
          filterable: false,
          // filter_type: 'range',
        },
      },
    ],
    crudOptions: {
      findOne: {
        includes: ['ingredients.ingredient'],
      },
    },
    relations: [
      {
        type: 'many',
        field: 'ingredients',
        fk_field: 'ingredient',
        pk_field: 'ingredient.id',
      },
    ],
    service: 'RimsService',
    object: 'ReceiptIngredientsMatching',
  }),
  receipts: EntityConfig.fromJson({
    title: 'Recipes',
    fields: [
      {
        key: 'image_url',
        type: 'image-preview',
        templateOptions: {
          label: 'Image',
        },
        expressionProperties: {
          'templateOptions.required': '!model.id',
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        list: {
          parser: 'image',
          cssStyle: { 'text-align': 'center' },
          filterable: false,
        },
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
            required: 'Field is required!',
          },
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
      {
        key: 'description',
        type: 'input',
        templateOptions: {
          label: 'Description',
          // required: true,
        },
        // validation: {
        //     messages: {
        //         required: "Field is required!",
        //     },
        // },
        list: {
          parser: 'ellips:50',
          filterable: false,
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
          filterable: false,
        },
      },
      {
        key: 'preparing',
        type: 'preparing',
        templateOptions: {
          label: 'Preparing',
          // required: true,
        },
        // validation: {
        //     messages: {
        //         required: "Field is required!",
        //     },
        // },
        list: {
          parser: 'ellips:100',
          hidden: true,
        },
      },
      {
        key: 'kcal',
        type: 'select',
        templateOptions: {
          label: 'Kcal',
          // required: true,
          options: [
            { label: 'Basso', value: 'low' },
            { label: 'Medio', value: 'medium' },
            { label: 'Alto', value: 'high' },
          ],
        },
        // validation: {
        //     messages: {
        //         required: "Field is required!",
        //     },
        list: {
          filter_type: 'text',
          filterable: true,
        },
        // }
      },
      {
        key: 'tags',
        type: 'select',
        templateOptions: {
          label: 'Tags',
          multiple: true,
          // required: true,
          options: [
            { label: 'Healthy', value: 'healthy' },
            { label: 'Quick n Easy', value: 'quick-n-easy' },
            { label: 'Primi', value: 'first' },
            { label: 'Secondi', value: 'second' },
            { label: 'Vegetariano', value: 'vegetarian' },
            { label: 'Gluten free', value: 'gluten-free' },
            { label: 'No oven', value: 'no-oven' },
            { label: 'No mixer', value: 'no-mixer' },
          ],
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
      {
        key: 'time',
        type: 'input',
        templateOptions: {
          label: 'Time',
          type: 'number',
          // required: true,
        },
        validation: {
          messages: {
            required: 'Inserisci un multiplo di 5',
          },
        },
        list: {
          filter_type: 'range',
          filterable: true,
        },
      },
      {
        key: 'active',
        type: 'checkbox',
        defaultValue: false,
        templateOptions: {
          label: 'Is active?',
        },
        list: {
          parser: 'checkbox',
          filter_type: 'checkbox',
          filterable: true,
        },
      },
      {
        key: 'verified',
        type: 'checkbox',
        defaultValue: false,
        templateOptions: {
          label: 'Is verified?',
        },
        list: {
          parser: 'checkbox',
          filter_type: 'checkbox',
          filterable: true,
        },
      },
      {
        key: 'priority',
        type: 'input',
        defaultValue: 1000,
        templateOptions: {
          label: 'Priority',
          type: 'number',
          required: true,
        },
        validation: {
          messages: {
            required: 'Non modificare!',
          },
        },
        list: {
          filter_type: 'range',
          filterable: true,
        },
      },
      {
        key: 'fk_user',
        type: 'one',
        templateOptions: {
          label: 'Creator',
          service: 'UsersService',
          selected_key: 'item.name + " " + item.surname',
          dataProvider: {
            label: 'email',
            value: 'email',
          },
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
    ],
    crudOptions: {
      findOne: {
        includes: ['ingredients.ingredient'],
      },
    },
    relations: [
      {
        type: 'many',
        field: 'ingredients',
        fk_field: 'ingredient',
        pk_field: 'ingredient.id',
      },
      { type: 'one', field: 'fk_user', pk_field: 'id' },
    ],
    service: 'ReceiptsService',
    object: 'Receipt',
  }),
  receiptsForCreator: EntityConfig.fromJson({
    title: 'Gestione ricette',
    fields: [
      {
        key: 'image_url',
        type: 'image-preview',
        templateOptions: {
          label: 'Image',
        },
        expressionProperties: {
          'templateOptions.required': '!model.id',
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        list: {
          parser: 'image',
          cssStyle: { 'text-align': 'center' },
          filterable: false,
        },
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
            required: 'Field is required!',
          },
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
      {
        key: 'description',
        type: 'input',
        templateOptions: {
          label: 'Description',
          // required: true,
        },
        // validation: {
        //     messages: {
        //         required: "Field is required!",
        //     },
        // },
        list: {
          parser: 'ellips:50',
          filterable: false,
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
          filterable: false,
        },
      },
      {
        key: 'preparing',
        type: 'preparing',
        templateOptions: {
          label: 'Preparing',
          // required: true,
        },
        // validation: {
        //     messages: {
        //         required: "Field is required!",
        //     },
        // },
        list: {
          parser: 'ellips:100',
          hidden: true,
        },
      },
      {
        key: 'kcal',
        type: 'select',
        templateOptions: {
          label: 'Kcal',
          // required: true,
          options: [
            { label: 'Basso', value: 'low' },
            { label: 'Medio', value: 'medium' },
            { label: 'Alto', value: 'high' },
          ],
        },
        // validation: {
        //     messages: {
        //         required: "Field is required!",
        //     },
        list: {
          filter_type: 'text',
          filterable: true,
        },
        // }
      },
      {
        key: 'tags',
        type: 'select',
        templateOptions: {
          label: 'Tags',
          multiple: true,
          // required: true,
          options: [
            { label: 'Healthy', value: 'healthy' },
            { label: 'Quick n Easy', value: 'quick-n-easy' },
            { label: 'Primi', value: 'first' },
            { label: 'Secondi', value: 'second' },
            { label: 'Vegetariano', value: 'vegetarian' },
            { label: 'Gluten free', value: 'gluten-free' },
            { label: 'No oven', value: 'no-oven' },
            { label: 'No mixer', value: 'no-mixer' },
          ],
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
      {
        key: 'time',
        type: 'input',
        templateOptions: {
          label: 'Time',
          type: 'number',
          // required: true,
        },
        validation: {
          messages: {
            required: 'Inserisci un multiplo di 5',
          },
        },
        list: {
          filter_type: 'range',
          filterable: true,
        },
      },
      {
        key: 'active',
        type: 'checkbox',
        defaultValue: false,
        templateOptions: {
          label: 'Is active?',
        },
        list: {
          parser: 'checkbox',
          filter_type: 'checkbox',
          filterable: true,
        },
      },
    ],
    crudOptions: {
      findOne: {
        includes: ['ingredients.ingredient'],
      },
    },
    relations: [
      {
        type: 'many',
        field: 'ingredients',
        fk_field: 'ingredient',
        pk_field: 'ingredient.id',
      },
      { type: 'one', field: 'fk_user', pk_field: 'id' },
    ],
    service: 'ReceiptsService',
    object: 'Receipt',
  }),
  orders: EntityConfig.fromJson({
    title: 'Orders',
    fields: [
      {
        key: 'id',
        type: 'label',
        templateOptions: {
          label: 'Id',
          type: 'text',
        },
        list: {
          filterable: true,
        },
      },
      {
        key: 'created',
        type: 'label',
        templateOptions: {
          label: 'Created',
          type: "date:'dd/MM/yyyy HH:mm'",
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        list: {
          parser: "date:'dd/MM/yyyy HH:mm'",
        },
      },
      {
        key: 'status',
        type: 'select',
        templateOptions: {
          label: 'Status',
          required: true,
          options: [
            { label: 'Payment pending', value: 'payment_pending' },
            { label: 'Paid', value: 'paid' },
          ],
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
      },
      // {
      //     key: 'transaction',
      //     type: 'count',
      //     templateOptions: {
      //         label: 'Ammount',
      //         type: "currency:2",
      //     },
      //     validation: {
      //         messages: {
      //             required: "Field is required!",
      //         },
      //     },
      //     list: {
      //         parser: "currency:2:€"
      //     }
      // },
      {
        key: 'address',
        type: 'label',
        templateOptions: {
          label: 'Address',
          type: 'text',
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        list: {
          hidden: true,
        },
      },
      {
        key: 'info',
        type: 'label',
        templateOptions: {
          label: 'Products',
          type: 'text',
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        list: {
          hidden: true,
        },
      },
      {
        key: 'delivery_method',
        type: 'select',
        templateOptions: {
          label: 'Delivery method',
          required: true,
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Footstep', value: 'footstep' },
          ],
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
      },
      {
        key: 'delivery_time',
        type: 'label',
        templateOptions: {
          label: 'Delivery time',
          required: true,
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
      },
      {
        key: 'name',
        type: 'label',
        templateOptions: {
          label: 'User',
          type: 'text',
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        // {
        //     key: 'fk_user',
        //     type: 'one',
        //     templateOptions: {
        //         label: 'User',
        //         required: true,
        //         service: 'UsersService',
        //         selected_key: 'item.name + " " + item.surname + " (" + item.email + ")"'
        //     },
        //     validation: {
        //         messages: {
        //             required: "Field is required!",
        //         },
        //     },
      },
    ],
    crudOptions: {
      find: {
        includes: ['transaction.amount'],
        orderBy: '-created',
      },
    },
    relations: [{ type: 'one', field: 'user', pk_field: 'ingredient.id' }],
    service: 'OrdersService',
    object: 'Order',
  }),
  images: EntityConfig.fromJson({
    title: 'Images',
    fields: [
      {
        key: 'url',
        type: 'image-preview',
        templateOptions: {
          label: 'Image',
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        expressionProperties: {
          'templateOptions.required': '!model.id',
        },
        list: {
          parser: 'image',
          cssStyle: { 'text-align': 'center' },
          filterable: false,
        },
      },
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Name',
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        list: {},
      },
      {
        key: 'url',
        type: 'label',
        templateOptions: {
          label: 'Url',
        },
        validation: {},
        list: {},
      },
    ],
    crudOptions: {
      find: {
        includes: [],
      },
    },
    listOptions: {
      rows: {
        extraButtons: [],
      },
    },
    service: 'ImagesService',
    object: 'BAImage',
  }),
  users: EntityConfig.fromJson({
    title: 'Users',
    fields: [
      {
        key: 'image_url',
        type: 'image-preview',
        templateOptions: {
          label: 'Image',
        },
        expressionProperties: {
          'templateOptions.required': '!model.id',
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        list: {
          parser: 'image',
          cssStyle: { 'text-align': 'center' },
          filterable: false,
        },
      },
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Name',
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
      {
        key: 'surname',
        type: 'input',
        templateOptions: {
          label: 'Surname',
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
      {
        key: 'email',
        type: 'input',
        templateOptions: {
          label: 'Email',
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
      {
        key: 'phone',
        type: 'input',
        templateOptions: {
          label: 'Phone',
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
      {
        key: 'nickname',
        type: 'input',
        templateOptions: {
          label: 'Nickname',
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
      {
        key: 'bio',
        type: 'input',
        templateOptions: {
          label: 'Bio',
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
      {
        key: 'roles',
        type: 'select',
        templateOptions: {
          label: 'Roles',
          multiple: true,
          required: false,
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Creator', value: 'creator' },
            { label: 'Verified Creator', value: 'verified creator' },
          ],
        },
        validation: {},
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
    ],
    crudOptions: {
      find: {
        includes: [],
      },
    },
    listOptions: {
      rows: {
        extraButtons: [],
      },
    },
    service: 'UsersService',
    object: 'User',
  }),
  profile: EntityConfig.fromJson({
    title: 'Profile',
    fields: [
      {
        key: 'image_url',
        type: 'image-preview',
        templateOptions: {
          label: 'Image',
        },
        expressionProperties: {
          'templateOptions.required': '!model.id',
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        list: {
          parser: 'image',
          cssStyle: { 'text-align': 'center' },
          filterable: false,
        },
      },
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Name',
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
      {
        key: 'surname',
        type: 'input',
        templateOptions: {
          label: 'Surname',
        },
        validation: {
          messages: {
            required: 'Field is required!',
          },
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
      {
        key: 'email',
        type: 'input',
        templateOptions: {
          label: 'Email',
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
      {
        key: 'phone',
        type: 'input',
        templateOptions: {
          label: 'Phone',
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
      {
        key: 'nickname',
        type: 'input',
        templateOptions: {
          label: 'Nickname',
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
      {
        key: 'bio',
        type: 'input',
        templateOptions: {
          label: 'Bio (max 50 words)',
        },
        list: {
          filter_type: 'text',
          filterable: true,
        },
      },
    ],
    crudOptions: {
      find: {
        includes: [],
      },
    },
    listOptions: {
      rows: {
        extraButtons: [],
      },
    },
    service: 'UsersService',
    object: 'User',
  }),
};
