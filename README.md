Task 1



The first challenge was to figure out the task and applying on the &quot;Theme Settings&quot;, as a result I searched for answers on the web. Through this, I learned more about the settings\_schema.json and was able to implement it into the Theme Settings section.

I used the Shopify&#39;s UI Elements Generator to create the HTML markups and applied to a **Snippets** section and created a _product-personalize_ file.

I added the &#39;required&#39; however it caused errors and would still submit even though it was not properly filled out. I had to research and all the answers available did not work on my part. As a result, I implemented my own coding in theme.js.liquid to stop the ajax call of adding the item to a cart.

**Merchant How To Use:**

If all the files had been properly modified (settings\_schema.json, product-personalize-liquid, theme.scss.liquid).

1. Under **Products,** click on the specific Product and change the Theme templates to _product.personalize_
2. Click **Save**
3. Click on **Online Store** \&gt; **Customize**
  1. Go tospecific Product page of the customized template
  2. Click on Product pages
  3. Check _Enable product personalization_
  4. To make changes to the line-items, go to Theme Settings \&gt; Personalize and choose the various options available



Task 2

2. The original task was to complete a collections order-page so I searched on Google and Shopify&#39;s forum and came to the tutorial section for _Add an order form to a collection page_

on [https://help.shopify.com/en/themes/customization/forms/add-order-form#add-an-order-form-to-a-collection-page](https://help.shopify.com/en/themes/customization/forms/add-order-form#add-an-order-form-to-a-collection-page) and followed the instructions. Afterwards, I made changes with help of Google and my current knowledge.

**Merchant How To Use:**

1. Follow the tutorials on the above link for _Add an order form to a collection page_

1. **Follow the Create a collection control your catalog page in the link:** [https://help.shopify.com/en/themes/customization/collections/change-catalog-page](https://help.shopify.com/en/themes/customization/collections/change-catalog-page)
  1. Instead of giving the title &quot;All&quot;, change to **&quot;order-form&quot;**
    1. This will create a url and handle as **/collections/order-form**
2. **Go to Themes \&gt;** Click on the **Action \&gt; Edit Code** to the desired Theme
  1. Under **Templates** \&gt; **collection.order-form.liquid,** find the following code:
{% assign collection = collections.your-collection-handle-here %}
and replace y **our-collection-handle-here** with **order-form**
i.e. %{assign collection = collections.order-form %}
  2. To test, insert your store&#39;s URL/collection/order-form
    1. i.e. [https://teststore.myshopify.com/collections/order-form](https://teststore.myshopify.com/collections/order-form)
3. To create a link
  1. in the Navigation: follow the tutorials on [https://help.shopify.com/en/manual/sell-online/online-store/menus-and-links/editing-menus](https://help.shopify.com/en/manual/sell-online/online-store/menus-and-links/editing-menus)
  2. In the header of your theme: (this requires knowledge of HTML tags and using the inspection tool of your browser)
    1. **Go to Themes \&gt;** Click on the **Action \&gt; Edit Code** to the desired Theme
      1. On your website, open the inspector tool to review the tags of the exiting links
      2. Under **Sections** \&gt; **header.liquid** , look for the element tags for the existing links and insert the following: \&lt;a href=&quot;/collections/order-form&quot;\&gt;Order-form\&lt;/a\&gt;
      3. Click **Save**



I implemented another way to make orders instead of creating a new page.

**How it works:**

- --while in the collections/all, when a customer clicks on an event, the quantity-selector will reveal itself under its respective product
- --

I wanted to do something other than create a new page for the following reasons:

1. New page may require an additional loading to a new page (more time in waiting to redirect to another page).

1. To approach a problem with my own thinking and to not redirect the customer to another page, but be able to make orders what is currently on the &#39;/collections/all&#39; page.
2. All the codes written are not copied from any sources, except for Shopify.additemToCart and Shopify.moveAlong as they were followed on the tutorial
3. The file can be found under **Assets \&gt; bulkOrders.js.liquiid** or the gist link:
[https://gist.github.com/PeterHjHan/5363f65b0eb2e389f72e706d20750c8c](https://gist.github.com/PeterHjHan/5363f65b0eb2e389f72e706d20750c8c)

**Note** : I read through Shopify&#39;s _Use Javascript Responsibly,_ however, my functions were not called when put it into a closure or when I had inserted my function inside the jQuery.noConflict method.

**Merchant How To Use:**

1. Go to Themes \&gt; Click on Action \&gt; Edit Code

1.
  1. Under Assets \&gt; Click &quot;Add a new asset&quot; \&gt;Create a blank file \&gt; type in bulkOrder and choose js.liquid
  2. Copy and paste the full code from the gist
2. Under Layout \&gt; theme.liquid, add the following code before the \&lt;/body\&gt; tag:
  1.   {{ &#39;bulkOrders.js&#39; | asset\_url | script\_tag }}
3. Under Sections \&gt; collection-template.liquid
  1. Find the {% schema %} and in the &quot;settings&quot;, add the following code :
    1. {

      &quot;type&quot;: &quot;checkbox&quot;,

      &quot;id&quot;: &quot;multi\_order\_enable&quot;,

      &quot;label&quot;: {

      &quot;en&quot;: &quot;Enable Multi-Order&quot;

      },

      &quot;default&quot; : true

 },

1.
  1. Afterwards, under the \&lt;header\&gt; tag, add the following code :
    1.    {% if section.settings.multi\_order\_enable %}

     \&lt;label class=&quot;visually-hidden&quot; id=&quot;multi\_\_order\_\_enable&quot;\&gt;\&lt;/label\&gt;

   {% endif %}

1. To enable or disable this feature,
  1. Themes \&gt; Customize \&gt; Choose &quot;Collection Pages&quot;
  2. Under Sections \&gt; Collection pages \&gt; Check &quot;Enable Multi-Order&quot; or uncheck
  3. Click **Save**