
document.addEventListener('DOMContentLoaded', () => {
  const buttonInfo = document.getElementById('get-info-btn');
  const buttonCart = document.getElementById('get-info-cart-btn');
  buttonInfo.addEventListener('click', ()=> popup(false));
  buttonCart.addEventListener('click', ()=> popup(true));
});

const popup = (isCart) => {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": isCart ? "isCart" : "isProduct"});
  });
}