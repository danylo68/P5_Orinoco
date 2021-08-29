//=======================Cumul de produiy par colonne=================================

function removeDublon(products) {
    let cleanProducts = []
    console.log(products);
    for (const product of products) {
        if (!cleanProducts.some(p => p._id === product._id && p.lenses === product.lenses)) {

            cleanProducts.push(product)
            console.log(cleanProducts);
        }
    }
    return cleanProducts
};

// =====================function compteur produit quantités============================
function countProduct(products, cleanProducts) {
    let cleanProductsWithCounter = []

    for (const cleanProduct of cleanProducts) {
        let counter = 0
        for (const product of products) {
            if (cleanProduct._id === product._id && cleanProduct.lenses === product.lenses) {
                counter++;
            }
            cleanProduct.counterPrice = product.price * counter
            cleanProduct.counter = counter

        }
        cleanProductsWithCounter.push(cleanProduct)
    }

    return cleanProductsWithCounter
};

//====================================fonction poubelle produit================================
function remvProduct(_id, lenses) {
    let getstockage = localStorage.getItem("myCard");
    let newCartProduct = JSON.parse(getstockage);

    for (let t = 0; t <= newCartProduct.length; t++) {

        if (newCartProduct[t]._id === _id && newCartProduct[t].lenses === lenses) {

            newCartProduct.splice(t, 1)
            let productJson = JSON.stringify(newCartProduct);
            localStorage.setItem("myCard", productJson);
            console.log("toto");
            break;
        }
    }
    alert("suprimé du panier");
    showCart();
};

//====================================fonction map=============================================
function showCart() {

    const getCartStorage = localStorage.getItem("myCard");
    const cartProduct = JSON.parse(getCartStorage);

    productWithoutDublon = removeDublon(cartProduct)

    uniqueProduct = countProduct(cartProduct, productWithoutDublon)

    document.getElementById("container").innerHTML = ("");

    //====================html produit-panier================================================================ 
    for (let i = 0; i < uniqueProduct.length; i++) {
        let addProduct =
            ` 
            <table class="table table-hover">
        <thead class="thead">
          <tr>
          <td><img id="imageUrl"  class="img-fluid " src=${uniqueProduct[i].imageUrl} width="150" height="30" alt="camera" /></td>
            <td><h5 id="name">${uniqueProduct[i].name}</h5></td>
            <td><h5 id="lenses">${uniqueProduct[i].lenses}</h5></td>
            <td><h5 id="price">${uniqueProduct[i].counterPrice/100},00 € </h5></td>
            <td><h5 id="Quantity">${uniqueProduct[i].counter}</h5></td>
            <td><button id="remv_item" onclick="remvProduct('${uniqueProduct[i]._id}', '${uniqueProduct[i].lenses}')" class="btn"><i class="fa fa-trash"></i></button></td>
          </tr>
          </thead>
        </table> `

        document.getElementById("container").innerHTML += (addProduct);
    };
    //=========================html total prix================================================
    let accumulatorProduct = cartProduct.reduce((accumulator, currentValue, index, array) => {
        return accumulator + currentValue.price
    }, 0);
    console.log(accumulatorProduct);

    const globalPriceProduct =
        ` <tfoot class="thead-dark">
                 <tr id="price__product">                    
                     <th></th>
                     <th><h4>Prix  Total  :</h4></th>
                     <th><h4>${accumulatorProduct/100},00 €</h4></th>
                 </tr>
             </tfoot>`

    document.getElementById("price__product").innerHTML = (globalPriceProduct);;
};

showCart()
    //===================================fin fonction showCart=========================

//===================================variable btn submit===========================
const myFormHtml =
    `<div class="cart_submit">
    <div class="row">
        <div class="col-md-6 pt-4 pb-4">    
        <input type="submit" id="submit" class="btn-success rounded-borders" name="submit" value="Envoyer"/>      
        </div>
    </div>
</div> `

document.getElementById("submit").innerHTML = (myFormHtml);


//=======================================================================================
//=============================function API post orderCam================================
function orderCam() {
    // recupération des ID s produit storage avec fonction map
    const getStorage = localStorage.getItem("myCard");
    const idProduct = JSON.parse(getStorage);

    const products = idProduct.map(obj => {
        return obj._id
    })
    console.log(products);

    const apiPost = "http://localhost:3000/api/cameras/order";

    //////////////////////informations formulaire  function formData//////////////////
    const formElemt = document.querySelector("#get_form");

    formElemt.addEventListener("submit", async(e) => {
        e.preventDefault();

        // variable pour approuvé la validation
        if (formElemt.checkValidity()) {
            alert("Formulaire approuvé");
        } else {
            alert("Information manquante");
        };

        // function formData pour récuperer les information du formulaire
        const formData = new FormData(formElemt);
        const formContact = Object.fromEntries(formData);

        // operateur de décomposition ...
        const contact = {
            ...formContact
        };
        console.log(contact);

        // envois de l'objet dans le local storage
        localStorage.setItem("contact", JSON.stringify(contact))

        // variable contenant les deux objets pour réponse API
        const globalContent = {
            contact,
            products
        }
        console.log(globalContent);


        try {
            const responseApi = await fetch(apiPost, {
                method: "POST",
                body: JSON.stringify(globalContent),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const objson = await responseApi.json();
            const prodObj = JSON.stringify(objson);
            localStorage.setItem("lastOrder", prodObj)
            console.log(prodObj);

        } catch (e) {
            console.error(e);
            alert("attention une erreur");
        }

    });
};

orderCam()
    //============================fin de fonction================================