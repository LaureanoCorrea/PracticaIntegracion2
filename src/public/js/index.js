document.addEventListener('DOMContentLoaded', function () {
	const socket = io(); //configuración para poder usar socket del lado del cliente
	console.log('Conectado al servidor de socket');

	socket.emit('message1', 'Conectado con websocket');

	function addProduct() {
		const title = document.getElementById('title').value;
		const description = document.getElementById('description').value;
		const price = document.getElementById('price').value;
		const thumbnail = document.getElementById('thumbnail').value;
		const code = document.getElementById('code').value;
		const stock = document.getElementById('stock').value;
		const status = document.getElementById('status').value;
		const category = document.getElementById('category').value;

		const errors = [];

		if (!title) {
			errors.push('El título es obligatorio');
		}

		if (!price) {
			errors.push('El precio es obligatorio');
		}

		if (!thumbnail) {
			errors.push('La URL de la imagen es obligatoria');
		}

		if (!code) {
			errors.push('El código es obligatorio');
		}

		if (!stock) {
			errors.push('La cantidad en stock es obligatoria');
		}

		if (!category) {
			errors.push('La categoría es obligatoria');
		}

		if (!status) {
			errors.push('El estado es obligatorio');
		}

		if (errors.length > 0) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: errors.join('\n'),
			});
			return false;
		}

		const product = {
			title,
			description,
			price,
			thumbnail,
			code,
			stock,
			status,
			category,
		};

		socket.emit('addProduct', product);
		document.getElementById('form_add').reset();
	}

	function deleteProduct(productId) {
		socket.emit('deleteProduct', { _id: productId });
	}

	socket.on('productsList', (data) => {
		const productList = document.getElementById('productList');

		if (productList && Array.isArray(data)) {
			productList.innerHTML = '';

			const table = document.createElement('table');
			table.id = 'product_table';
			table.innerHTML = `
              <thead>
                  <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Precio</th>
                      <th>Código</th>
                      <th>Eliminar</th>
                  </tr>
              </thead>
              <tbody>
              </tbody>
          `;

			data.forEach((product) => {
				const row = document.createElement('tr');
				row.innerHTML = `
                  <td>${product.title}</td>
                  <td>${product.description}</td>
                  <td>$${product.price}</td>
                  <td>${product.code}</td>
                  <td><button type="button" class="delete_button" onclick="deleteProduct('${product._id}')">X</button></td>
              `;
				table.querySelector('tbody').appendChild(row);
			});

			productList.appendChild(table);
		} else {
			console.log(`Faltan Datos.`, productList);
		}
	});

	// Swal.fire({
	// 	title: 'Ingresa tu e-mail para poder continuar',
	// 	input: 'email',
	// 	text: 'Ingresa e-mail',
	// 	inputValidator: (value) => {
	// 		return !value && 'Datos requeridos';
	// 	},
	// 	allowOutsideClick: false,
	// }).then((result) => {
	// 	email = result.value;
	// 	console.log('email:', email);
	// });

	const chatbox = document.getElementById('chatbox');
	if (chatbox) {
		chatbox.addEventListener('keyup', function (evt) {
			if (evt.key === 'Enter') {
				if (chatbox.value.trim().length > 0) {
					socket.emit('message', { email, message: chatbox.value });
					chatbox.value = '';
				}
			}
		});
	}

	socket.on('messageLogs', (data) => {
		const messageLogs = document.querySelector('#messageLogs');
		let mensajes = '';

		data.forEach((mensaje) => {
			if (mensaje.email === email) {
				mensajes += `<p class="self-message"><strong>You:</strong> ${mensaje.message}</p>`;
			} else {
				mensajes += `<p class="other-message"><strong>${mensaje.email}:</strong> ${mensaje.message}</p>`;
			}
		});

		messageLogs.innerHTML = mensajes;
		messageLogs.scrollTop = messageLogs.scrollHeight;
	});

	socket.on('cartUpdated', (updatedCart) => {
		const cartBody = document.getElementById('cartBody');

		cartBody.innerHTML = '';

		updatedCart.forEach((product) => {
			const row = document.createElement('tr');
			row.innerHTML = `
          <td>${product.product.title}</td>
          <td>${product.product.description}</td>
          <td>$${product.product.price}</td>
          <td>${product.quantity}</td>
          <td><img src="${product.product.thumbnail}" alt="${product.product.title}" /></td>
          <td><button onclick="editProduct('${product.product._id}')">Editar</button></td>
          <td><button onclick="deleteProduct('${product.product._id}')">Eliminar</button></td>
        `;
        cartBody.appendChild(roe);
		});
	});

  function editProduct(productId) {
    const newQuantity = prompt('Ingrese la nueva cantidad del producto:');
    if (newQuantity !== null) {
        // Enviar la solicitud al servidor para editar la cantidad del producto en el carrito
        socket.emit('editProductQuantityInCart', { productId, newQuantity });
    }
}

	// Función para eliminar un producto del carrito
	function deleteProductFromCart(productId) {
		socket.emit('deleteProductFromCart', productId);
	}

	function editProductQuantityInCart(productId, newQuantity) {
		socket.emit('editProductQuantityInCart', { productId, newQuantity }); // Enviar la solicitud al servidor para editar la cantidad del producto en el carrito
	}
});
