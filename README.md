## Task 1

The first challenge was to figure out the task and apply the feature to **Theme Settings**, as a result I searched for answers on the web. Through this, I learned more about the settings_schema.json and was able to implement it

I used the Shopify'ss UI Elements Generator to create the HTML markups and applied to a **Snippets** section and created a `product-personalize file`.

I added the `required` however it caused errors and would still submit even though it was not properly filled out. After researching the web, the solutions did not work. Thus, I implemented my own coding in theme.js.liquid to stop the ajax call of adding the item to a cart.

**Merchant How To Use:**

If all the files had been properly modified (settings\_schema.json, product-personalize-liquid, theme.scss.liquid).

1. Under **Products,** click on the specific Product and change the Theme templates to `product.personalize`
2. Click **Save**
3. Click on **Online Store** > **Customize**
    1. Go to specific Product page of the customized template
    2. Click on Product pages
    3. Check `Enable product personalization`
    4. To make changes to the line-items, go to **Theme Settings** > **Personalize** and choose the various options available



## Task 2

The task was to complete a collections order-page so I searched on Google and Shopify's forum and came to the tutorial section for `Add an order form to a collection page` on [link](https://help.shopify.com/en/themes/customization/forms/add-order-form#add-an-order-form-to-a-collection-page) and followed the instructions. Afterwards, I made changes to the liquid file with help of searching and my current knowledge.

**Merchant How To Use:**

1. Follow the tutorials on the above link for `Add an order form to a collection page`.
2. Follow the `Create a collection control your catalog page` in the link: [link](https://help.shopify.com/en/themes/customization/collections/change-catalog-page)
    1. Change the title to `Order-Form`.
        1. This will create a url and handle as **/collections/order-form**
3. **Go to Themes** > **Action** > **Edit Code** to the desired Theme
    1. Under **Templates** > **collection.order-form.liquid,** find the following code:
    ```{% assign collection = collections.your-collection-handle-here %}```and replace **your-collection-handle-here** with **order-form** 
    ```%{assign collection = collections.order-form %}```
4. Go to **Themes** > **Action** > **Edit Code**
    1. Under **Assets** > `Add a new asset` > Create a blank file > type in `bulkOrder` and choose js.liquid
    2. Copy and paste the full code from the [gist link](https://gist.github.com/PeterHjHan/5363f65b0eb2e389f72e706d20750c8c)
5. To create a link
    1. In the Navigation: follow the tutorials on [link](https://help.shopify.com/en/manual/sell-online/online-store/menus-and-links/editing-menus)
    2. In the header of your theme: (this requires knowledge of HTML tags and using the inspection tool of your browser)
        1. **Go to Themes** > **Action** > **Edit Code** to the desired Theme
            1. On your browser, open the inspector tool to review the tags of the exiting links
            2. Under the theme's code **Sections** > **header.liquid** , look for the element tags for the existing links and insert the following: `<a href="/collections/order-form">Order-Form</a>`
            3. Click **Save**


## Task 2 Bonus

I wanted to do something other than create a new page for the following reasons:

* New page costs additional loading time (performance reduction)
* more data-consumption (mobile users) 
* additional GET requests (trying to reduce server load)

**How it works:**

* While in the collections/all page, when a customer clicks on the **Multi-Order** on the header, the quantity-selector will reveal itself under its respective product

* The file can be found under **Assets** > **bulkOrders.js.liquiid** or the [gist link](https://gist.github.com/PeterHjHan/5363f65b0eb2e389f72e706d20750c8c)

**Note** : I read through Shopify's `Use Javascript Responsibly` but my functions were not called when put it into a closure or when I had inserted my function inside the jQuery.noConflict method.

**Merchant How To Use:**

1. Go to **Themes** > **Action** > **Edit Code**
    1. Under **Assets** > `Add a new asset` > Create a blank file > type in `bulkOrder` and choose js.liquid
    2. Copy and paste the full code from the gist
2. Under **Layout** > theme.liquid, add the following code before the </body> tag:
    ```{{ 'bulkOrders.js' | asset_url | script_tag }}```
3. Under **Sections** > collection-template.liquid
    1. Find the {% schema %} and in the **Settings**, add the following code :
    ```
      {
        "type": "checkbox",
        "id": "multi-order-enable",
        "label": {
          "en": "Enable Multi-Order"
          },
        "default" : true
      },
    ```
    2. Afterwards, under the </header> tag, add the following code :
      ```
      {% if section.settings.multi-order-enable %}
        </label class="visually-hidden" id="multi\_\_order\_\_enable">\&lt;/label>
      {% endif %}
      ```

4. To enable or disable this feature,
  1. **Themes** > **Customize** > Choose "Collection Pages"
  2. Under Sections > Collection pages > Check "Enable Multi-Order" or uncheck
  3. Click **Save** 