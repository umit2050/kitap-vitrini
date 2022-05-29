const kitapItem = document.querySelector("#kitap-item"); // textbox 
const kitapEkle = document.querySelector("#ekle"); // tıklama butonu
let itemsArray = localStorage.getItem("okunanlar") ? JSON.parse(localStorage.getItem("okunanlar")) : [];

// Liste öğelerini oluşturmak için
kitapEkle.onclick = function() {
    // textbox'ın içeriğini alıyoruz, boşsa eklemiyoruz
    if (kitapItem.value != "") {
    // div'leri oluşturuyoruz
    let kitap = document.createElement("div"); 
    kitap.className = "kitap";

    let silDiv = document.createElement("div");
    silDiv.className = "silDiv";

    // div'lerin içeriğini oluşturuyoruz
    let kitapKapak = document.createElement("img"); // textbox'tan değeri okuyup aktarıyoruz
    kitapKapak.src = kitapItem.value;
    silDiv.innerHTML = "<button value='🗑️' id='sil' onclick='sil(this)' class='sil'>🗑️</button>" // sil butonunu oluşturuyoruz

    // div'leri liste öğesine ekliyoruz
    liste.appendChild(kitap); // liste maddesi
    kitap.append(kitapKapak); // liste maddesi içeriği
    kitap.append(silDiv); // liste maddesi içeriği

    // textbox'a yazılan değeri localStorage'a ekliyoruz
    itemsArray.push(kitapItem.value);
    localStorage.setItem("okunanlar", JSON.stringify(itemsArray));

    // liste öğesini ekledikten sonra textbox'ı temizliyoruz
    kitapItem.value = "";
    }
}

// Sayfayı yeniledikten sonra liste öğelerini gösterebilmek için
if (itemsArray.length != 0) {
    // Liste öğelerini tek tek çağırıyoruz
    for(let s = 0; s < itemsArray.length; s++) {
    // div'leri oluşturuyoruz
    let kitap = document.createElement("div"); 
    kitap.className = "kitap";

    let silDiv = document.createElement("div");
    silDiv.className = "silDiv";

    // div'lerin içeriğini oluşturuyoruz
    let kitapKapak = document.createElement("img"); // textbox'tan değeri okuyup aktarıyoruz
    kitapKapak.src = itemsArray[s];
    silDiv.innerHTML = "<button value='🗑️' id='sil' onclick='sil(this)' class='sil'>🗑️</button>"; // sil butonu

    // div'leri liste öğesine ekliyoruz
    liste.appendChild(kitap); // liste maddesi
    kitap.append(kitapKapak); // liste maddesi içeriği
    kitap.append(silDiv); // liste maddesi içeriği
    }
}

// Tüm liste öğelerini silmek için
temizle.onclick = function() {
    // localStorage'ı temizliyoruz
    localStorage.clear();
    itemsArray = [];

    while (liste.firstChild) {
    liste.removeChild(liste.firstChild);
    }
}

// Liste öğelerini tek tek silmek için
function sil(r) {
    // silme butonuna tıklayınca seçilen maddeyi siliyoruz
    let silinecek = r.parentNode.parentNode;
    silinecek.parentNode.removeChild(silinecek);

    // localStorage'dan silinecek öğeyi çıkartıyoruz
    let silinecekIndex = itemsArray.indexOf(silinecek.childNodes[0].textContent);
    itemsArray.splice(silinecekIndex, 1);
    localStorage.setItem("okunanlar", JSON.stringify(itemsArray));
}

// Silme butonlarını görünür hale getirmek için
tekSil.addEventListener("click", silGoster);

function silGoster() {
    let silDivler = document.querySelectorAll(".silDiv");
    for (let i = 0; i < silDivler.length; i++) {
        if(silDivler[i].style.display == "block")
        silDivler[i].style.display = "none";
        else
        silDivler[i].style.display = "block";
    }
}

// Enter'a basıldığında liste öğesinin eklenmesini sağlıyoruz
document.onkeydown = function(e){
    let key = e.key;
    if(key == "Enter"){
        if (kitapItem.value != "") {
            kitapEkle.click();
        }
    }
}

// Sortable özelliği (SortableJS)
const dragArea = document.querySelector(".liste");
new Sortable(dragArea, {
    animation: 350,
    // Seçili öğenin arka plan rengini değiştiriyoruz
    onChoose: function (evt) {
        let item = evt.item;
        item.style = "background-color: #ECFFB7";
    },
    // Seçili öğe bırakıldıktan sonra arkaplan rengi sıfırlanıyor
    onUnchoose: function (evt) {
        let item = evt.item;
        setTimeout(function () {
            item.style = "background-color: #fff";
            item.style.transition = "background-color 0.2s";
        }, 350);
    },
    // Sıralama işlemi bittikten sonra öğelerin yeni sırasını localStorage'a kaydediyoruz
    onEnd: function (evt) {
        let item = evt.item;
        let parent = item.parentNode;
        let newOrder = Array.prototype.indexOf.call(parent.children, item);
        let oldOrder = itemsArray.indexOf(item.childNodes[0].textContent);
        itemsArray.splice(newOrder, 0, itemsArray.splice(oldOrder, 1)[0]);
        localStorage.setItem("okunanlar", JSON.stringify(itemsArray));
    }
});

// Özellikler

// Liste genişliğini değiştirme
let listeGenislik = document.querySelector("#listeGenislik");
listeGenislik.onchange = function() {
    let deger = listeGenislik.value;
    document.querySelector("#liste").style.width = deger + "px";
}

// Kitap kapağı genişliğini değiştirme
let kapakGenislik = document.querySelector("#kapakGenislik");
kapakGenislik.onchange = function() {
    let kapaklar = document.querySelectorAll(".kitap");
    let deger = kapakGenislik.value;
    for (let i = 0; i < kapaklar.length; i++) {
        kapaklar[i].style.height = deger + "px";
    }
}