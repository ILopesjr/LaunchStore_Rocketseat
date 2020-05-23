const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,'./public/images')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now().toString()}-${file.originalname}`)
  }
})

// Verificar o formato da img no Backend (Verificado no Frontend e será reforçado aqui)
const fileFilter = (req, file, cb) => {
  const isAccepted = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/ico']
  .find(acceptedFormat => acceptedFormat == file.mimetype)

  if(isAccepted) {
    return cb(null, true)
  }
  // Como fazer aviso para informar que o formato não foi aceito?
  return cb(null, false)
}

module.exports = multer ({
  storage,
  fileFilter
})