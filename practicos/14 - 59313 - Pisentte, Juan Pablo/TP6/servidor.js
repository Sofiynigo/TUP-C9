import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';

const app = express();
const users = {};  

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));


app.post('/register', (req, res) => {
    const { username, password } = req.body;
    console.log('Solicitud de registro:', username, password); 
    if (users[username]) {
        return res.status(400).json({ message: 'El usuario ya existe' });
    }
    users[username] = password;
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Solicitud de inicio de sesión:', username, password); 
    if (users[username] && users[username] === password) {
        res.cookie('user', username, { httpOnly: true });
        return res.status(200).json({ message: 'Inicio de sesión exitoso' });
    }
    res.status(400).json({ message: 'Nombre de usuario o contraseña inválidos' });
});


app.post('/logout', (req, res) => {
    console.log('Solicitud de cierre de sesión'); 
    res.clearCookie('user');
    res.status(200).json({ message: 'Cierre de sesión exitoso' });
});

app.get('/info', (req, res) => {
    const username = req.cookies.user;
    console.log('Solicitud de info, usuario:', username); 
    if (username) {
        return res.status(200).json({ message: `Bienvenido, ${username}` });
    }
    res.status(401).json({ message: 'No autorizado' });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve('public', 'index.html'));
});

app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});
