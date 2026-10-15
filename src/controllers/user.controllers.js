const getUsers = (req, res) => {
    res.json({ msg: 'Obtiene todos los usuarios' });
};

const registrarUsers = (req, res) => {
    res.json({ msg: 'Registra  todos los usuarios' });
};

const actualizarUsers = (req, res) => {
    res.json({ msg: 'Actualizar todas las propiedades de un usuario' });
}   

const actualizarParcialUsers = (req, res) => {
    res.json({ msg: 'Actualizar una o mas propiedades del usuario' });
}   

const eliminarUsers = (req, res) => { 
    res.json({ msg: 'Elimina un usuario' });
}

export{
    registrarUsers,
    getUsers,
    actualizarUsers,
    actualizarParcialUsers,
    eliminarUsers
}