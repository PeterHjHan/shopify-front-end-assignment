Shopify.queue = [];

function enableBulkOrders() {
  var collections = $('#shopify-section-collection-template');
  var products = collections.find('.product');
  addOrderButton();
  products.each((function () {
    var productAPI = $(this).find('.supports-js a').attr('href');
    var __this = $(this);

    jQuery.getJSON(productAPI + '.js', function (result) {
      
      var variantId = result.variants[0].id

      if (result.variants.length > 1) {
        var variants = [];
        result.variants.forEach((variant) => {
          variants.push(variant);
        });

        addVariantLayout(__this, variants);
      } else {
        addIncreasedQuantityLayout($(__this), variantId);
      }
      
      addToQueue(__this, variantId);
      
    });
  }));
}

function addIncreasedQuantityLayout(target, variantId) {
  var container = $('<div class="product__bulk__container"></div>');
  var input = $('<input class="quantity-selector" type="number" value="0" min="0">');
  var variantId = $('<label class="visually-hidden" variant-id="' + variantId + '"/></label>');

  var element = $(container).append(variantId).append(input);

  if (!$(target).find('.product__bulk__container').length) {
    $(target).append(element);
    $(element).hide().slideDown();
  }
}


function addOrderButton() {
  var orderButton = $('<a href="#" id="bulk-order-button">Order</a>');
  var spacer = $('<span class="vertical-divider small--hide"></span>');

  orderButton = $(orderButton).prepend(spacer);

  if (!$('#bulk-order-button').length) {
    $('#bulk-order').after(orderButton);
    moveToCheckout();
  }
}

function addToQueue(target, variantID) {

  var tempCartStore = {};

  $(target).find('.quantity-selector').change(function () {

    var quantity = parseInt(jQuery(this).val(), 10) || 0

    tempCartStore = {
      id: variantID,
      quantity: quantity
    }
    //adds the variantID into Shopify.queue
    var variantIDexists = Shopify.queue.some(item => item.id === variantID);

    if (quantity !== 0) {
      $(this).css('background-color', 'rgb(38, 194, 129)');
    } else {
      $(this).css('background-color', '#f4f4f4');
    }

    if (!variantIDexists) {
      Shopify.queue.push(tempCartStore);
    }

    //updates the Quantity of the Shopify.queue with its variantID
    var index = Shopify.queue.findIndex((tempCart => tempCart.id === variantID));
    Shopify.queue[index].quantity = quantity;

    //removes the variantID when quantity reaches 0;
    if (Shopify.queue[index].quantity === 0) {
      Shopify.queue.splice(index, 1);
    }

  });
};

function moveToCheckout() {
  $('#bulk-order-button').click(function (e) {

    e.preventDefault();

    Shopify.moveAlong();
  });
}


Shopify.moveAlong = function () {

  if (Shopify.queue.length) {
    var request = Shopify.queue.shift();
    Shopify.addItemToCart(request, Shopify.moveAlong);
  } else {
    document.location.href = '/cart';
  }
};

Shopify.addItemToCart = function (item, callback) {

  $.ajax({
    url: '/cart/add.js',
    dataType: 'json',
    type: 'POST',
    data: {
      quantity: item.quantity,
      id: item.id,
    }
  }).then(function (res) {
    callback();
  });
}

function addVariantLayout(target, variants) {
  
  var container = $('<div class="product__bulk__container"></div>');
  var input = $('<input class="quantity-selector" type="number" value="0" min="0">');

  var select = $('<select class="single-option-selector" data-option="option1" id="ProductSelect-product-template-option-0"></select');
//   var variantId = $('<label class="visually-hidden" variant-id="' + result.variants[0].id + '"/></label>');
  variants.forEach((variant) => {
    var option = $('<option value ="' + variant.title + '">' + variant.title + '</option>');
    select.append(option);
    var variantId = $('<label class="visually-hidden" variant-id="' + variant.id + '"/></label>');

  });
  
  var element = container.append(select).append(input)
    
  $(target).append(element);
  $(element).hide().slideDown();
  
}