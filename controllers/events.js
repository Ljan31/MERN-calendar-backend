const Evento = require('../models/Evento');

// populate
// "eventos": [
//         {
//             "title": "cumpleanios",
//             "notes": "Comprar pastel",
//             "start": "1970-01-01T00:00:00.001Z",
//             "end": "1970-01-01T00:16:40.000Z",
//             "user": {
//                 "_id": "66b6827ed181671d2be48ed1",
//                 "name": "Limberg",
//                 "email": "email@gmail.com",
//                 "password": "$2a$10$xBiwzzXt.Wr0Wyixo/OhZeyxhBI0tJLESv9Yb5a/KVsEPOradIQFm",
//                 "__v": 0
//             },
//             "id": "66bb81900ee1095e61470606"
//         },
    

const getEventos = async(req, res) => {
  
  try {
    const eventos = await Evento.find()
                                .populate('user','name');

    res.status(200).json({
      ok: true,
      msg: 'getEventos',
      eventos
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'por favor hable con el administrador(evento)',
    });
  }
};

const crearEvento = async(req, res) => {

  const evento = new Evento( req.body );

  try {

    evento.user = req.uid;

    const eventoGuardado = await evento.save();

    res.status(201).json({
      ok: true,
      msg: 'crear evento',
      evento: eventoGuardado
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'por favor hable con el administrador (Crear evento)',
    });
  }
};

const actualizarEvento = async(req, res) => {
  
  const eventoId= req.params.id;
  const uid = req.uid;
  try {

    const evento = await Evento.findById(eventoId);

    if( !evento ){
      return res.status(404).json({
        ok: false,
        msg: 'Evento no existe por ese id',
      });  
    }

    if( evento.user.toString() !== uid ){
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegio de editar este evento',
      });
    }

    const newEvento = {
      ...req.body,
      user: uid
    }

    const eventoUpdated = await Evento.findByIdAndUpdate(eventoId, newEvento, {new: true});

    return res.status(200).json({
      ok: true,
      msg: 'evento actualizado',
      eventoUpdated
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'por favor hable con el administrador(actualizarEvento)',
    });
  }
};

const eliminarEvento = async(req, res) => {
  const eventoId= req.params.id;
  const uid = req.uid;
  try {

    const evento = await Evento.findById(eventoId);

    if( !evento ){
      return res.status(404).json({
        ok: false,
        msg: 'Evento no existe por ese id',
      });  
    }

    if( evento.user.toString() !== uid ){
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegio de eliminar este evento',
      });
    }

    await Evento.findByIdAndDelete(eventoId);

    return res.status(200).json({
      ok: true,
      msg: 'evento eliminado',
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'por favor hable con el administrador(eliminarEvento)',
    });
  }
};


module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento
}