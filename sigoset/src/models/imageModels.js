const pool = require("../config/database");
const { findAll, findById, create, update } = require("./ProductModel");

const Imagen ={
    findAll: function(){
        return pool.execute("SELECT * FROM imagenes")
    },

    findById: function (id_imagen){
        return pool.execute("SELECT * FROM imagenes WHERE id_imagen = ?",[id_imagen])
        .then(([rows])=>{
            if(rows.length === 0 ) return null;
            return rows[0]
        })
     
    },

    create: function (ImagenData) {
        const sql = "INSERT INTO imagenes (url_imagen, tipo_imagen, categoria_imagen) VALUES (?,?, ?)";
        return pool.execute(sql, [
            ImagenData.url_imagen,
            ImagenData.tipo_imagen,
            ImagenData.categoria_imagen,
        ]);
    },
    

    update: function(id_imagen, ImagenData){
        const sql = "UPDATE imagenes SET id_imagen = ?, url_imagen = ?, tipo_imagen=?,categoria_imagen=?  WHERE id_imagen = ?"
        return pool.execute(sql,[
            ImagenData.url_imagen,
            id_imagen
        ]);
    },

    deleteById: function (id_imagen) {
        return pool.execute("DELETE FROM imagenes WHERE id_imagen = ?", [id_imagen]);
    },
    
}
module.exports = Imagen;
