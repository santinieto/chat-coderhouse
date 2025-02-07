const socket = io();

const getUsername = () => {
    const data = Swal.fire({
        title: 'Ingresá tu nombre',
        input: 'text',
        inputLabel: 'Nombre con el cual se debe identificar al usuario dentro del chat',
        allowOutsideClick: false,
        inputValidator: (username) => {
            if (!username) {
                return 'Debes ingresar un nombre!';
            }
        }
    })
    
    // Retornamos el nombre de usuario
    return data;
}

const showNewUserNotification = (username) => {
    // Swal.fire({
    //     toast: true,
    //     position: 'top-end',
    //     icon: 'success',
    //     title: `${username} se ha unido al chat!`,
    //     showConfirmButton: false,
    //     timer: 3000,
    // });
    
    Toastify({
        text: `${username} se ha unido al chat!`,
        duration: 3000
        }).showToast();
}

const main = async () => {
    const username = await getUsername();
    // console.log("Nuevo usuario en el chat:", username.value)
    
    // Formulario
    const $chatForm = document.getElementById('chat-form');
    const $chatInput = document.getElementById('chat-input');
    const $chatBox = document.getElementById('chat-box');
    
    // Le avisamos al servidor que un nuevo usuario se conecto
    socket.emit('new user', username.value);
    
    // Actualizo el historial de mensajes
    socket.on('chat history', (messages) => {
        messages.forEach(({id, text}) => {
            $chatBox.innerHTML += `<p>${id}: ${text}</p>`;
        });
    });
    
    // Notificacion de nuevo usuario
    socket.on('new user notification', (username) => {
        showNewUserNotification(username)
    });
    
    // Eventos
    $chatForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = $chatInput.value;
        $chatInput.value = '';
        socket.emit('chat message', { username: username.value, message });
    });
    
    // Muestro el mensaje nuevo
    socket.on('broadcast message', (message) => {
        $chatBox.innerHTML += `<p>${message.username}: ${message.message}</p>`;
    });
}
main()