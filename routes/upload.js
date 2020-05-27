var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
 
 
var app = express();
app.use(fileUpload());
 
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');
 
 
// RUTAS
app.put('/:tipo/:id', (req, res, next) => {
 
    var tipo = req.params.tipo;
    var id = req.params.id;
 
    // TIPOS DE COLECCION
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errors: { message: 'Tipo de colección no válida' }
        });
    }
 
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error: No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }
 
    // OBTENER NOMBRE DEL ARCHIVO
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];
 
    //SOLO ESTAS EXTENSIONES SE ACEPTAN
    var extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
 
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error: Extensión No Válida',
            errors: { message: 'Las extensiones válidas son: ' + extensionesValidas.join(', ') }
        });
    }
 
    // NOMBRE DEL ARCHIVO PERSONALIZADO
    var nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extensionArchivo}`;
 
    // MOVER ARCHIVO DEL TEMPORAL A UN PATH
    var path = `./uploads/${tipo}/${nombreArchivo}`;
 
    archivo.mv(path, err => {
 
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
 
        subirPorTipo(tipo, id, nombreArchivo, res);
 
        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido',
        //     extensionArchivo: extensionArchivo
        // });
 
    });
 
});
 
function subirPorTipo(tipo, id, nombreArchivo, res) {
 
    if (tipo === 'usuarios') {
 
        Usuario.findById(id, (err, usuario) => {
 
            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }
 
            var pathViejo = './uploads/usuarios/' + usuario.img;
 
            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
 
            usuario.img = nombreArchivo;
 
            usuario.save((err, usuarioActualizado) => {
 
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'La imagen no se pudo actualizar',
                        errors: err
                    });
                }
 
                usuarioActualizado.password = ':)';
 
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }



        if ( tipo === 'medicos') {


                
        Medico.findById(id, (err, medico) => {
 
            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe' }
                });
            }
 
            var pathViejo = './uploads/medicos/' + medico.img;
 
            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
 
            medico.img = nombreArchivo;
 
            medico.save((err, medicoActualizado) => {
 
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'La imagen no se pudo actualizar',
                        errors: err
                    });
                }
 
                medicoActualizado.password = ':)';
 
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });
            });
        });
                
        
     }
            
         if ( tipo === 'hospitales') {
            
       
            Hospital.findById(id, (err, hospital) => {
 
                if (!hospital) {
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Hospital no existe',
                        errors: { message: 'Hospital no existe' }
                    });
                }
     
                var pathViejo = './uploads/hospitales/' + hospital.img;
     
                // Si existe, elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }
     
                hospital.img = nombreArchivo;
     
                hospital.save((err, hospitalActualizado) => {
     
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'La imagen no se pudo actualizar',
                            errors: err
                        });
                    }
     
                    hospitalActualizado.password = ':)';
     
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de hospital actualizada',
                        hospital: hospitalActualizado
                    });
                });
            });         
    
    }
}
 
 
module.exports = app;







