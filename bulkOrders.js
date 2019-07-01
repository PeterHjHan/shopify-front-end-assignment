
Shopify.queue = [];

function enableBulkOrders() {
 var collections = $('#shopify-section-collection-template');
 var products = collections.find('.product');
  addOrderButton();  
  products.each((function() {
	var productAPI = $(this).find('.supports-js a').attr('href');
    var __this = $(this);
    
    addIncreasedQuantityLayout($(__this, productAPI));
    
    jQuery.getJSON(productAPI+'.js', function(result) { 
      
      var variantId = $('<label class="visually-hidden" variant-id="' + result.id + '"/></label>');
       $(__this).find('.product__bulk__container').append(variantId);
      addtoCart(__this, result.id);
      
      
      if (result.variants.length > 1) {
        var variants = [];
        result.variants.forEach((variant) => {
          variants.push(variant);
        });
			addVariantLayout(variants);
    	}
    });
  })); 
} 

function addIncreasedQuantityLayout(target, productAPI) {
  var container = $('<div class="product__bulk__container"></div>');
  var input =$('<input class="quantity-selector" type="number" value="0" min="0">');
  
  var element = $(container).append(input);
  
  if ( ! $(target).find('.product__bulk__container').length ) {
   $(target).append(element);
   
  }
               
}


function addOrderButton() {
  var orderButton = $('<a href="#" id="bulk-order-button">Order</a>');
  var spacer = $('<span class="vertical-divider small--hide"></span>');
    
  orderButton = $(orderButton).prepend(spacer);
  
  if( ! $('#bulk-order-button').length ) {
    
    $('#bulk-order').after(orderButton);
    moveToCheckout();
  }
}

function addtoCart(target, variantID) {
  
  var tempCartStore = {};

  $(target).find('.quantity-selector').change(function() {
    
    var quantity = parseInt(jQuery(this).val(), 10) || 0
    
    tempCartStore = {
      id: variantID,
      quantity: quantity
    }
    //adds the variantID into Shopify.queue
	var variantIDexists = Shopify.queue.some(item => item.id === variantID);
    
    if (!variantIDexists) {
      Shopify.queue.push(tempCartStore);
    }
                 
    //updates the Quantity of the Shopify.queue with its variantID
    var index = Shopify.queue.findIndex((tempCart => tempCart.id === variantID));
	Shopify.queue[index].quantity = quantity;
  });
};


function moveToCheckout() {
  
  $('#bulk-order-button').click(function(e) {
    e.preventDefault();
    console.log('link clicked')
    if(Object.keys(tempCartStore).length !==0) {
      Shopify.queue.push(tempCartStore);
    }

      Shopify.moveAlong = function() {
        console.log("FUNCTION");
  // If we still have requests in the queue, let's process the next one.
      if (Shopify.queue.length) {
        console.log("IFFFFF")
        var request = Shopify.queue.shift();
        Shopify.addItem(request.variantId, request.quantity, Shopify.moveAlong);
      }
      // If the queue is empty, we will redirect to the cart page.
      else {
        console.log("REDIRECT TO CART");
        document.location.href = '/cart';
      }
};
    
  });
  

};

function addVariantLayout(variants) {
  var select = $('<select class="single-option-selector" data-option="option1" id="ProductSelect-product-template-option-0"></select');
  variants.forEach((variant) => {
	var option = $('<option value ="' +
                   variant.title +
                   '" />' +
                   variant.title +
                   '</option>');
	select.append(option);
  });
  
}
