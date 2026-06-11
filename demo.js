import {getProducts,getProductById,getAllCart,writeToFile,updateProduct,readToFile} from './function.js';
var main = async function () {
    try {
        //get products
        const products = await getProducts();
        writeToFile('products.json', products); // write to file products.json

        //update products
        const productPriceChange = products.map(product => ({ id: product.id, price: product.price + 10 }));
        const updatedProducts = await Promise.all(productPriceChange.map(product => updateProduct(product.id, { price: product.price })));
        console.log(updatedProducts);

        //get product and cart
        const product = await getProductById(1);
        const carts = await getAllCart();
        writeToFile('carts.json', carts); // write to file cart.json
        carts.forEach(cart => console.log(cart));

        // map cart and product
        const cartsWithProduct = carts.filter(cart => cart.products.some(p => p.productId === product.id));
        cartsWithProduct.forEach(cart => console.log(cart));

        //Read file products.json
        const productsData = await readToFile("products.json");
        productsData.forEach(product => console.log(product));

        //Read file carts.json
        const cartsData = await readToFile("carts.json");
        cartsData.forEach(cart => console.log(cart));

        const setProduct = new Set(cartsData.flatMap(cart => cart.products.map(p=>p.productId)));
        //Console products in cart
        const cartProducts = productsData.filter(product => setProduct.has(product.id));
        console.log(cartProducts);

        //Console products not in cart
        const nonCartProducts = productsData.filter(product => !setProduct.has(product.id));
        console.log(nonCartProducts);
    }
    catch (error) {
        console.error("Error: " + error.message);
    }
}

main();
