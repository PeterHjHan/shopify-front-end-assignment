Shopify.queue = [];
Shopify.bulkOrders = {};

var multiOrderButton = $('<span class="vertical-divider small--hide"></span><a href="#" onClick="Shopify.bulkOrders.enableBulkOrders()" id="bulk-order">Multi-Order</a>');

$('#multi__order__enable').closest('body').find('.top-bar.grid').children().last().append(multiOrderButton);

Shopify.bulkOrders.enableBulkOrders = function () {
  var collections = $('#shopify-section-collection-template');
  var products = collections.find('.product');
  Shopify.bulkOrders.addOrderButton();
  Shopify.bulkOrders.multiOrderButtonToggle();
  products.each((function () {
    var productAPI = $(this).find('.supports-js a').attr('href');
    var __this = $(this);

    jQuery.getJSON(productAPI + '.js', function (result) {
      
      console.log(result);

      var variantId = result.variants[0].id;

      if (result.available) {
        if (result.variants.length > 1) {
          var variants = [];
          result.variants.forEach((variant) => {
            variants.push(variant);
          });

          Shopify.bulkOrders.addVariantLayout(__this, variants);
        } else {
          Shopify.bulkOrders.addIncreasedQuantityLayout($(__this), variantId);
        }
      }
    });
  }));
}

//Layout created when there are NO options
Shopify.bulkOrders.addIncreasedQuantityLayout = function (target, variantId) {
  var container = $('<div class="product__bulk__container"></div>');
  var input = $('<input class="quantity-selector" type="number" value="0" min="0">');
  var variantIdLabel = $('<label class="visually-hidden" variant-id="' + variantId + '"/></label>');

  var element = $(container).append(variantIdLabel).append(input);

  if (!$(target).find('.product__bulk__container').length) {
    $(target).append(element);
    $(element).hide().slideDown("normal", function () {
      Shopify.bulkOrders.addToQueue(target, variantId);
    });
  }
}

//Creates the "Order" Button on the top right to invoke the moveToCheckout()
Shopify.bulkOrders.addOrderButton = function () {
  var orderButton = $('<span class="vertical-divider small--hide"></span><button href="#" class="order-button" id="bulk-order-button">Order</button>');

  if (!$('#bulk-order-button').length) {
    $('#bulk-order').after(orderButton);
    Shopify.bulkOrders.moveToCheckout();
  }
}

//Changes text and hides all the .quantity-selector when the "Multi-Order" button is clicked
Shopify.bulkOrders.multiOrderButtonToggle = function () {

  var text = $('#bulk-order').text();

  if (text === 'Disable Multi') {
    $('#bulk-order').text('Multi-Order');
    $('#bulk-order-button').hide();
    $('.product__bulk__container').slideUp();
  } else {

    $('#bulk-order').text('Disable Multi');
    $('#bulk-order-button').show();
    $('.product__bulk__container').slideDown();

  }
}

Shopify.bulkOrders.addToQueue = function (target) {

  var tempCartStore = {};

  $(target).find('.quantity-selector').change(function () {
    var variantID = $(this).siblings('.visually-hidden').attr('variant-id');
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

Shopify.bulkOrders.moveToCheckout = function () {
  $('#bulk-order-button').click(function (e) {

    e.preventDefault();
    
    if(Shopify.queue.length > 0) {
      $(this).text('Submitting');
	  $(this).prop('disabled', true);	
      $(this).css({ 'border': '1px solid #d3d3d3', 'color' : '#d3d3d3' });
      Shopify.bulkOrders.moveAlong();
      
    } else {
     alert('You have no items selected'); 
    }

  });
}


Shopify.bulkOrders.moveAlong = function () {

  if (Shopify.queue.length) {
    var request = Shopify.queue.shift();
    Shopify.bulkOrders.addItemToCart(request, Shopify.bulkOrders.moveAlong);
  } else {
    document.location.href = '/cart';
  }
};

//Adds each item from the Shopify.Queue array to the Cart
Shopify.bulkOrders.addItemToCart = function (item, callback) {

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


//When There are multiple variant options, this function renders the quantity with different options
Shopify.bulkOrders.addVariantLayout = function (target, variants) {

  variants.forEach((variant) => {
    var container = $('<div class="product__bulk__container"></div>');
    var variantTitle = $('<p>' + variant.title + '</p>');
    var input = $('<input class="quantity-selector" type="number" value="0" min="0">');
    var variantIdLabel = $('<label class="visually-hidden" variant-id="' + variant.id + '"/></label>');
    var element = container.append(variantTitle).append(variantIdLabel).append(input)

    variantTitle.css({'display': 'inline', 'margin-right': '20px'} );

    if ($(target).find('.product__bulk__container').length < variants.length) {

      $(target).append(element);
      $(element).hide().slideDown("normal", function () {
        Shopify.bulkOrders.addToQueue(target);
      });
    }
  });
}


//This is the section For the order-form page

var websiteURL = window.location.pathname.includes('order-form');

if (websiteURL) {

  var tempCartStore = {};

  $('.quantity-selector').change(function () {
    var variantID = $(this).siblings('.visually-hidden').attr('variant-id');
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

  Shopify.bulkOrders.moveToCheckout();

  //Increases the Quantity
  $('tbody').find('.increase-quantity').each(function () {
    $(this).click(function () {
      var quantityValue = parseInt($(this).siblings('.quantity-selector').val());
      var maximumValue = parseInt($(this).siblings('.quantity-selector').attr('max'));

      quantityValue == maximumValue ? maximumValue : quantityValue++;

      $(this).siblings('.quantity-selector').val(quantityValue);
      $(this).siblings('.quantity-selector').change();
    });
  });

  //Decrease the Quantity
  $('tbody').find('.decrease-quantity').each(function () {
    $(this).click(function () {
      var quantityValue = parseInt($(this).siblings('.quantity-selector').val());
      quantityValue == 0 ? 0 : quantityValue--;

      $(this).siblings('.quantity-selector').val(quantityValue);
      $(this).siblings('.quantity-selector').change();
    });
  });

}