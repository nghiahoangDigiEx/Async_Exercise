import fs from "fs/promises";
const url1 = 'https://fakestoreapi.com';
const url2 = 'https://dummyjson.com';
const timeout = new Promise((_,reject) => {
    setTimeout(() => {
        reject(new Error("Operation timed out"));
    }, 5000);
});
export async function getProducts() {
    try {
        const response = await fetch(`${url1}/products`);
        console.log("Response details (getProducts):", {
            url: response.url,
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            contentType: response.headers.get('content-type')
        });
        if (!response.ok) {
            console.log("Response details (getProducts):", {
                url: response.url,
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                contentType: response.headers.get('content-type')
            });
            throw new Error("Failed to fetch products, status: " + response.status);
        }
        const data = await response.json();
        return data.products || data;
    }
    catch (error) {
        throw new Error("Failed to fetch products: " + error.message);
    }
}
export async function getProductById(id) {
    try {
        const response = await Promise.race([Promise.any([
            fetch(`${url1}/products/${id}`),
            fetch(`${url2}/products/${id}`)
        ]), timeout]);
        console.log("Response details (getProductById):", {
            url: response.url,
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            contentType: response.headers.get('content-type')
        });
        if (!response.ok) {
            throw new Error("Product not found with id: " + id);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        throw new Error("Failed to fetch product: " + error.message);
    }
}
export async function updateProduct(id, updatedData) {
    try {
        const response = await Promise.race([fetch(`${url1}/products/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        }), timeout]);
        const datas= await response.json();
        console.log("Response details (updateProduct):", {
            url: response.url,
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            content: response.body,
            contentType: response.headers.get('Content-Type'),
            body: datas
        });
         
        return datas;
    }
    catch (error) {
        throw new Error("Failed to update product: " + error.message);
    }
}
export async function getAllCart() {
    try {
        const response = await Promise.race([fetch('https://fakestoreapi.com/carts'), timeout]);
        console.log("Response details (getAllCart):", {
            url: response.url,
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            contentType: response.headers.get('content-type')
        });
        if (!response.ok) {
            throw new Error("Failed to fetch carts, status: " + response.status);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        throw new Error("Failed to fetch carts: " + error.message);
    }
}

export async function writeToFile(filename, data) {
    try {
        await fs.writeFile(filename, JSON.stringify(data, null, 2));
    }
    catch (error) {
        throw new Error("Failed to write to file: " + error.message);
    }
}

export async function readToFile(filename){
    try{
        return JSON.parse(await fs.readFile(filename,'utf8'));
    }
    catch(error){
        throw new Error("Failed to read file: " + error.message);
    }
}