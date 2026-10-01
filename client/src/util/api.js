const API_IP = 'http://localhost';
const API_PORT = 9000;

const headers = {
    // https://www.rfc-editor.org/rfc/rfc7231#section-5.3.2
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept
    'Accept': '*/*',
    // https://www.rfc-editor.org/rfc/rfc7231#section-3.1.1.5
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
    'Content-Type': 'application/json'
}

const serverRoute = (route) => `${API_IP}:${API_PORT}/${route}`;
const stats = {
}
const users = {
    getUsers: async () => {
        let response = await fetch(serverRoute("users"), {
            headers,
            method: 'GET'
        });
        let data = await response.json();
        return data;
    },
    getUser: async (user_id) => {
        let response = await fetch(serverRoute("users/"+user_id), {
            headers,
            method: 'GET'
        });
        let data = await response.json();
        return data[0];
    },
    loginUser: async (username, password) => {
        let response = await fetch(serverRoute("users/login/"+username+"-"+password), {
            headers,
            method: 'GET'
        });
        let data = await response.json();
        return data;
    },
    blockUser: async (username, username2) => {
        let response = await fetch(serverRoute("users/block/" + username + "-" +username2), {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method: 'POST',
        });
        return response;
    }, 
    postUser: async (user) => {
        let response = await fetch(serverRoute("db/adduser"), {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method: 'POST',
            json: true, 
            body: JSON.stringify(user),
        });
        return response;
    },
    removeUser: async (user) => {
        let response = await fetch(serverRoute("db/removeuser"), {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method: 'POST',
            json: true, 
            body: JSON.stringify(user),
        });
        return response;
    },
    updateUser: async (user) => {
        let response = await fetch(serverRoute("db/updateuser"), {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method: 'POST',
            json: true, 
            body: JSON.stringify(user),
        });
        return response;
    },
}
const surveys = {
    
}
const images = {
    postImage: async (image) => {
        let response = await fetch(serverRoute("db/addimage"), {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method: 'POST',
            json: true, 
            body: JSON.stringify(image),
        });
        return response;
    },
    removeImage: async (image_id) => {
        let response = await fetch(serverRoute("db/removeimage/"+image_id), {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method: 'POST',
            json: true, 
            body: JSON.stringify(image_id),
        });
        let data = await response.json();
        return data[0];
    },
    getImages: async (user_id) => {
        let response = await fetch(serverRoute("images/" + user_id), {
            headers,
            method: 'GET'
        });
        let data = await response.json();
        return data;
    },
    getImage: async (image_id) => {
        let response = await fetch(serverRoute("image/" + image_id), {
            headers,
            method: 'GET'
        });
        let data = await response.json();
        return data;
    },
}
const products =  {
    postProduct: async (product) => {
        let response = await fetch(serverRoute("db/addproduct"), {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method: 'POST',
            json: true, 
            body: JSON.stringify(product),
        });
        return response;
    },
    updateProduct: async (product) => {
        let response = await fetch(serverRoute("db/updateproduct"), {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method: 'POST',
            json: true, 
            body: JSON.stringify(product),
        });
        return response;
    },
    getProducts: async () => {
        let response = await fetch(serverRoute("products"), {
            headers,
            method: 'GET'
        });
        let data = await response.json();
        return data;
    },
    getUserProducts: async (user_id) => {
        let response = await fetch(serverRoute("products/"+user_id), {
            headers,
            method: 'GET'
        });
        let data = await response.json();
        return data[0];
    },
    getProduct: async (user_id) => {
        let response = await fetch(serverRoute("product/"+user_id), {
            headers,
            method: 'GET'
        });
        let data = await response.json();
        return data[0];
    },
    removeProduct: async (product_id) => {
        let response = await fetch(serverRoute("db/removeproduct/"+product_id), {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method: 'POST',
            json: true, 
            body: JSON.stringify(product_id),
        });
        let data = await response.json();
        return data[0];
    },
}

export {
    users,
    images,
    surveys,
    stats,
    products
}