// Número com DDI+DDD, só dígitos.
var WHATSAPP_NUMBER = "5551989706471";

var PRODUCTS = [
  {id:"camiseta-essencial",category:"Camisetas",name:"Camiseta essencial",description:"Conforto leve para acompanhar qualquer plano.",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=720&q=80",fallback:"images/camisetas.svg"},
  {id:"camiseta-street",category:"Camisetas",name:"Camiseta street",description:"Visual urbano com personalidade de sobra.",image:"https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=720&q=80",fallback:"images/camisetas.svg"},
  {id:"moletom-urbano",category:"Moletons",name:"Moletom urbano",description:"Camada extra de atitude para os dias frescos.",image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=720&q=80",fallback:"images/moletons.svg"},
  {id:"calca-casual",category:"Calças",name:"Calça casual",description:"Um caimento versátil, do dia à noite.",image:"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=720&q=80",fallback:"images/calcas.svg"},
  {id:"tenis-urbano",category:"Tênis",name:"Tênis urbano",description:"Seu próximo passo começa pelo conforto.",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=720&q=80",fallback:"images/tenis.svg"},
  {id:"perfume-presenca",category:"Perfumes",name:"Perfume marcante",description:"Uma fragrância para deixar sua assinatura.",image:"https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=720&q=80",fallback:"images/acessorios.svg"},
  {id:"perfume-fresh",category:"Perfumes",name:"Fragrância fresh",description:"Notas leves para renovar a rotina.",image:"https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=720&q=80",fallback:"images/acessorios.svg"},
  {id:"brincos-detalhe",category:"Acessórios",name:"Brincos & detalhes",description:"O toque final que muda toda a composição.",image:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=720&q=80",fallback:"images/acessorios.svg"},
  {id:"relogio-classico",category:"Acessórios",name:"Relógio clássico",description:"Funcionalidade e estilo em cada momento.",image:"https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=720&q=80",fallback:"images/acessorios.svg"},
  {id:"touca-easy",category:"Acessórios",name:"Touca everyday",description:"Acessório essencial para os dias mais frios.",image:"https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=720&q=80",fallback:"images/acessorios.svg"},
  {id:"cuidados-diarios",category:"Cuidados",name:"Cuidado diário",description:"Pequenos rituais que fazem bem para você.",image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=720&q=80",fallback:"images/acessorios.svg"},
  {id:"shorts-active",category:"Shorts",name:"Shorts active",description:"Liberdade para se movimentar no seu ritmo.",image:"https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=720&q=80",fallback:"images/shorts.svg"}
];
var FILTERS = ["Todos","Roupas","Camisetas","Moletons","Calças","Shorts","Tênis","Perfumes","Acessórios","Cuidados"];
var clothing = ["Camisetas","Moletons","Calças","Shorts","Tênis"];
var currentFilter = "Todos";
var cart = {};
var toastTimer;

function escapeHtml(value){
  return String(value || "").replace(/[&<>"']/g,function(character){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character];
  });
}
function whatsappUrl(message){
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}
function matchingProducts(){
  var query = document.getElementById("product-search").value.trim().toLocaleLowerCase("pt-BR");
  return PRODUCTS.filter(function(product){
    var categoryMatches = currentFilter === "Todos" ||
      (currentFilter === "Roupas" && clothing.indexOf(product.category) !== -1) ||
      product.category === currentFilter;
    var queryMatches = !query || (product.name + " " + product.category + " " + product.description).toLocaleLowerCase("pt-BR").indexOf(query) !== -1;
    return categoryMatches && queryMatches;
  });
}
function renderCatalog(){
  var tabs = document.getElementById("tabs");
  tabs.innerHTML = FILTERS.map(function(filter){
    return '<button type="button" class="tab'+(filter === currentFilter ? " on" : "")+'" data-filter="'+escapeHtml(filter)+'" aria-pressed="'+(filter === currentFilter)+'">'+escapeHtml(filter === "Todos" ? "Tudo" : filter)+'</button>';
  }).join("");
  tabs.querySelectorAll(".tab").forEach(function(button){
    button.addEventListener("click",function(){
      currentFilter = button.getAttribute("data-filter");
      renderCatalog();
    });
  });
  var products = matchingProducts();
  document.getElementById("result-count").textContent = products.length + (products.length === 1 ? " opção para explorar" : " opções para explorar");
  document.getElementById("grid").innerHTML = products.length ? products.map(function(product){
    return '<article class="card"><div class="card-media"><img loading="lazy" src="'+escapeHtml(product.image)+'" alt="'+escapeHtml(product.name)+'" onerror="this.onerror=null;this.src=\''+escapeHtml(product.fallback)+'\'"><span class="card-tag">'+escapeHtml(product.category)+'</span></div><div class="info"><small>LS STORES / EDIT</small><h3>'+escapeHtml(product.name)+'</h3><p>'+escapeHtml(product.description)+'</p><button class="btn" type="button" data-add="'+escapeHtml(product.id)+'">Adicionar à sacola <span aria-hidden="true">+</span></button></div></article>';
  }).join("") : '<div class="empty-results">Não encontramos esse item. Experimente outra busca ou fale com a LS Stores.</div>';
  document.querySelectorAll(".category-tile").forEach(function(tile){
    tile.onclick = function(){
      currentFilter = tile.getAttribute("data-filter");
      renderCatalog();
    };
  });
}
function cartMessage(){
  var lines = Object.keys(cart).map(function(id){
    var product = PRODUCTS.find(function(item){return item.id === id;});
    return product ? cart[id] + "x " + product.name + " (" + product.category + ")" : "";
  }).filter(Boolean);
  return "Olá! Vim pelo site da LS Stores. Quero consultar disponibilidade e valores destes itens:\n" + lines.join("\n");
}
function renderCart(){
  var ids = Object.keys(cart).filter(function(id){return cart[id] > 0;});
  var total = ids.reduce(function(sum,id){return sum + cart[id];},0);
  var count = document.getElementById("cart-count");
  count.textContent = total;
  document.getElementById("cart-open").setAttribute("aria-label","Abrir sacola, "+total+(total === 1 ? " item" : " itens"));
  document.getElementById("cart-items").innerHTML = ids.length ? ids.map(function(id){
    var product = PRODUCTS.find(function(item){return item.id === id;});
    if(!product) return "";
    return '<article class="cart-item"><img src="'+escapeHtml(product.image)+'" alt="" onerror="this.onerror=null;this.src=\''+escapeHtml(product.fallback)+'\'"><div><small>'+escapeHtml(product.category)+'</small><h3>'+escapeHtml(product.name)+'</h3><button type="button" data-remove="'+escapeHtml(id)+'">Remover</button></div><div class="quantity"><button type="button" data-quantity="-1" data-id="'+escapeHtml(id)+'" aria-label="Remover uma unidade de '+escapeHtml(product.name)+'">−</button><span>'+cart[id]+'</span><button type="button" data-quantity="1" data-id="'+escapeHtml(id)+'" aria-label="Adicionar uma unidade de '+escapeHtml(product.name)+'">+</button></div></article>';
  }).join("") : '<p class="cart-empty">Sua sacola está vazia por enquanto. Explore o catálogo e salve seus favoritos aqui.</p>';
  var checkout = document.getElementById("cart-checkout");
  checkout.href = whatsappUrl(cartMessage());
  checkout.classList.toggle("disabled",!ids.length);
  checkout.setAttribute("aria-disabled",String(!ids.length));
}
function showToast(message){
  var toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(function(){toast.classList.remove("show");},2400);
}
document.querySelectorAll("[data-wa]").forEach(function(link){
  link.href = whatsappUrl(link.getAttribute("data-wa"));
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});
document.getElementById("product-search").addEventListener("input",renderCatalog);
document.getElementById("grid").addEventListener("click",function(event){
  var button = event.target.closest("[data-add]");
  if(!button) return;
  var id = button.getAttribute("data-add");
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  showToast("Adicionado à sua sacola.");
});
document.getElementById("cart-items").addEventListener("click",function(event){
  var remove = event.target.closest("[data-remove]");
  var quantity = event.target.closest("[data-quantity]");
  if(remove){
    delete cart[remove.getAttribute("data-remove")];
  }else if(quantity){
    var id = quantity.getAttribute("data-id");
    cart[id] = (cart[id] || 0) + Number(quantity.getAttribute("data-quantity"));
    if(cart[id] <= 0) delete cart[id];
  }else{
    return;
  }
  renderCart();
});
var dialog = document.getElementById("cart-dialog");
document.getElementById("cart-open").addEventListener("click",function(){dialog.showModal();});
document.getElementById("cart-close").addEventListener("click",function(){dialog.close();});
dialog.addEventListener("click",function(event){
  if(event.target === dialog) dialog.close();
});
document.getElementById("bg").addEventListener("click",function(){
  var menu = document.getElementById("menu");
  var isOpen = menu.classList.toggle("open");
  this.setAttribute("aria-expanded",String(isOpen));
  this.setAttribute("aria-label",isOpen ? "Fechar menu" : "Abrir menu");
});
document.querySelectorAll("#menu a").forEach(function(link){
  link.addEventListener("click",function(){
    document.getElementById("menu").classList.remove("open");
    document.getElementById("bg").setAttribute("aria-expanded","false");
    document.getElementById("bg").setAttribute("aria-label","Abrir menu");
  });
});
document.getElementById("yr").textContent = new Date().getFullYear();
renderCatalog();
renderCart();
