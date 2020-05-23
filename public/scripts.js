const Mask = {
  apply(input, func) {
    setTimeout(()=>{
      input.value = Mask[func](input.value)
    },1)
  },

  formatBRL(value){
    value = value.replace(/\D/g,"")
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value/100)
  },
  cpfCnpj(value){
    value = value.replace(/\D/g,"")

    if (value.length > 14)
      value = value.slice(0, -1)

    if(value.length > 11){
      //cnpj - 99.999.999/9999-99 (14)
      value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d)/,"$1.$2.$3/$4-$5") 

    }else{
      //cpf - 999.999.999-99 (11)
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d)/,"$1.$2.$3-$4")

    }
    return value

  },
  cep(value){
    value = value.replace(/\D/g,"")
  
    if (value.length > 8)
      value = value.slice(0, -1)

    //cep - 99999-999 (8)
    value = value.replace(/(\d{5})(\d)/,"$1-$2") //99999-999

    return value
    
  }
}

const Validate = {
  apply(input, func) {
    Validate.clearErrors(input)

    let results = Validate[func](input.value)
    input.value = results.value

    if(results.error)
      Validate.displayError(input, results.error)

  },
  displayError(input, error){
    const div = document.createElement('div')
    div.classList.add('error')
    div.innerHTML = error
    input.parentNode.appendChild(div)
    input.focus()
  },
  clearErrors(input){
    const errorDiv = input.parentNode.querySelector('.error')
    if(errorDiv)
      errorDiv.remove()
  },
  isEmail(value){
    let error = null

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ 

    if(value.length > 0 && !value.match(mailFormat))
      error = "E-mail Inválido!"
    
    return {
      error,
      value
    }
  },
  isCpfCnpj(value){
    let error = null

    const cleanValues = value.replace(/\D/g, "")

    if(cleanValues.length > 0){
      if(cleanValues.length > 11 && cleanValues.length !== 14){
        error = "CNPJ Incorreto!"
      } 
      else if( cleanValues.length < 12 && cleanValues.length !== 11){
        error = "CPF Incorreto!"
      }
    }
    
    return {
      error,
      value
    }
  },
  isCep(value){
    let error = null

    const cleanValues = value.replace(/\D/g, "")
    
    if(cleanValues.length > 0 && cleanValues.length !== 8)
      error = "CEP Inválido!"
      
    return {
      error,
      value
    }
  },
  allFields(event){
    const items = document.querySelectorAll('.item input, .item select, .item textarea')
    const price = document.querySelector('.item input[name=price]')
  
    let inputs = true, values = true

    const valuePrice = price.value.replace(/\D/g, "")

    if(valuePrice < 100){
      values = false
    }

    for(item of items){
        if(item.value == ""){
          inputs = false
        }
    }

    if(!inputs || !values) {
      const message = document.createElement('div')
      const text = document.createElement('p')
      message.classList.add('messages')
      message.classList.add('error')
      if(!inputs){
        text.innerHTML = `Por favor, prencha todos os campos!`
      } 
      else {
        text.innerHTML = 'Por favor, insira um valor válido!'
      }
      message.append(text)
      document.querySelector('body').append(message)

      event.preventDefault()
    }
  },
  allFieldsUpdate(event){
    const items = document.querySelectorAll('.item input[name=name], .item input[name=quantity],.item textarea')
    const imgs = document.querySelectorAll('.item img')
    const price = document.querySelector('.item input[name=price]')
  
    let inputs = true, values = true, previews = true

    const gallery = imgs.length
    const valuePrice = price.value.replace(/\D/g, "")

    if(!gallery){
      previews = false
    }

    if(valuePrice < 100){
      values = false
    }

    for(item of items){
        if(item.value == ""){
          inputs = false
        }
    }

    if(!inputs || !values || !previews) {
      const message = document.createElement('div')
      const text = document.createElement('p')
      message.classList.add('messages')
      message.classList.add('error')
      if(!inputs){
        text.innerHTML = `Por favor, prencha todos os campos!`
      } 
      else if(!previews) {
        text.innerHTML = 'Por favor, insira pelo menos uma imagem!'
      } else {
        text.innerHTML = 'Por favor, insira um valor válido!'
      }
      message.append(text)
      document.querySelector('body').append(message)

      event.preventDefault()
    }
  }
}

const PhotosUpload = {
  input: "",
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 6,
  files: [],
  handleFileInput(event){
    const { files: fileList } = event.target
    PhotosUpload.input = event.target

    if(PhotosUpload.hasLimit(event)) return

    Array.from(fileList).forEach(file => {
      PhotosUpload.files.push(file)      
      
      const reader = new FileReader() //criar um arquivo tipo BLOB (Binary Large Object - Pode conter até 4Gb de dados binários)

      // Quando Carrega o arquivo img cria toda estrutura HTML para o frontend
      reader.onload = () => {
        const image = new Image() //<img/> no HTML
        image.src = String(reader.result)

        const div = PhotosUpload.createContainer(image)

        PhotosUpload.preview.appendChild(div)
      }

      reader.readAsDataURL(file) // ler o arquivo img

    })

    // substituindo os files intransmutável pelo files criado no getAllFiles
    PhotosUpload.input.files = PhotosUpload.getAllFiles()
  },
  hasLimit(event){
    const { uploadLimit, input, preview } = PhotosUpload
    const { files: fileList } = input

    if(fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos!`)
      event.preventDefault()
      return true
    }

    const photosContainer = []
    preview.childNodes.forEach(item => {
      if(item.classList && item.classList.value == "photo") 
        photosContainer.push(item)
    })

    const totalPhotos = fileList.length + photosContainer.length
    if(totalPhotos > uploadLimit) {
      alert(`Você atingiu o limite máximo de ${uploadLimit} fotos!`)
      event.preventDefault()
      return true
    }

    return false;
  },
  getAllFiles(){
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files

  },
  createContainer(image){

    const container = document.createElement('div')

    container.classList.add('photo')
    container.onclick = PhotosUpload.removeImgBeforeDB

    container.appendChild(image)
    container.appendChild(PhotosUpload.createIconRemove())

    return container
    
  },
  createIconRemove(){
    const icon = document.createElement('i')
    icon.classList.add('fas', 'fa-trash-alt')
    return icon
  },
  removeImgBeforeDB(event){
    const photoDiv = event.target.parentNode //selecionar o elemento PAI do elemento DOM
    const photosArray = Array.from(PhotosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)

    // removendo file do files criado na posição do index
    PhotosUpload.files.splice(index, 1)
    PhotosUpload.input.files = PhotosUpload.getAllFiles()
    photoDiv.remove();
  },
  removeImgAfterDB(event){
    const photoDiv = event.target.parentNode //selecionar o elemento PAI do elemento DOM

    if(photoDiv.id){
      const removedFiles = document.querySelector('input[name="removed_files"]')
      if(removedFiles){
        removedFiles.value += `${photoDiv.id},`
      }
    }

    photoDiv.remove();
  }
}

const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight > img'),
  preview: document.querySelectorAll('.gallery-preview img'),
  setImage(event){
    const { target } = event

    ImageGallery.preview.forEach(image => image.classList.remove('active'))
    target.classList.add('active')

    ImageGallery.highlight.src = target.src
    Lightbox.image.src = target.src
  }
}

const Lightbox = {
  target: document.querySelector('.lightbox-target'),
  image: document.querySelector('.lightbox-target img'),
  closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
  open(){
    Lightbox.target.style.opacity = 1
    Lightbox.target.style.top = 0
    Lightbox.target.style.bottom = 0
    Lightbox.closeButton.style.top = 0
  },
  close(){
    Lightbox.target.style.opacity = 0
    Lightbox.target.style.top = "-100%"
    Lightbox.target.style.bottom = "initial"
    Lightbox.closeButton.style.top = "-80px"
  }
}