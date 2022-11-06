let timeout;
let attempts = 0;

chrome.runtime.onMessage.addListener(
  function(request) {
    if(document.readyState === 'complete') {
      handleFunctions(request.message)
      return
    }
    document.addEventListener('DOMContentLoaded', () => {
      handleFunctions(request.message)
    });
  }
);

const handleFunctions = (message) => {
  if(message !== "isCart" ) {
    getInfoFromProducts();
    return
  };
  getCartFromPage();
}

const getInfoFromProducts = () => {
  try {
    const pageTitle = document.title;
    const productString = document.querySelector('.productView-title').innerText;
    const productId = productString.match(/\(P[^\)]+/)[0].split(' ')[1];
    const productName = productString.split(/\(([^\)]+)\)/)[2].toString().trim();
    const productPrice = document.querySelector('.money').innerText;
    const productStockString = document.querySelector('.hotStock-text').innerText;
    const productStock = parseInt(productStockString.match(/\d+/)[0]);
    const productDeliveryTime = document.querySelectorAll('.product__text.des p')[1].innerText || '';
    const productIsOnSale = !!(document.querySelector('.badge.sale-badge'));
    const productReviewsString =  document.querySelector('.productView-meta.clearfix .spr-badge-caption').innerText;
    const productReviews = parseInt(productReviewsString.match(/\d+/)[0]);
    const productReviewsValue = (document.querySelectorAll('.productView-rating .spr-badge .spr-starrating.spr-badge-starrating i.spr-icon-star').length || 0);
    const productInfo = {
      productId,
      pageTitle,
      productName,
      productPrice,
      productStock,
      productDeliveryTime,
      productIsOnSale,
      productReviews,
      productReviewsValue
    };
    openResultInNewTab(productInfo);
  } catch (error) {
    alert('Algo deu errado, espere a página carregar e tente novamente');
  }
  
}

const getCartFromPage = () => {
  try {
    let productsString = getProductString();
    let productsPrices = document.querySelectorAll('.previewCartItem-content .price .money') || [];;
    let productId = '';
    let productName = '';
    let result = [];
    
    if(productsString && productsString.length) {
      productsString.forEach((productString, index) => {
        productId = productString.textContent.match(/\(P[^\)]+/)[0].split(' ')[1];
        productName = productString.textContent.split(/\(([^\)]+)\)/)[2].toString().trim();
        productPrice = productsPrices[index].textContent.split(/[\$\£\€](\d+(?:\.\d{1,2})?)/)[1].toString().trim()
        productPrice = `$${productPrice}`
        result.push({
          productId,
          productName,
          productPrice
        })
      });
      openResultInNewTab(result);
      return
    };
    openResultInNewTab([{
      title: 'Não há produtos no carrinho',
      message: 'Tente novamente!'
    }]);
  } catch (error) {
    alert('Algo deu errado, espere a página carregar e tente novamente');
  }
  
};

const getProductString = () => {
  return document.querySelectorAll('.previewCartItem-content .previewCartItem-name.link-underline') || [];
}

const openResultInNewTab = (productInfo) => {
  const myjson = JSON.stringify(productInfo, null, 2);
  const openNewTab = window.open();
  openNewTab.document.open();
  openNewTab.document.write('<html><body><pre>' + myjson + '</pre></body></html>');
  openNewTab.document.close();
};
