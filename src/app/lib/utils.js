const Intl = require('intl')
module.exports = {
  
  date(timestamp){
    const date = new Date(timestamp)

    const day = `0${date.getDate()}`.slice(-2)
    const month = `0${date.getMonth()+1}`.slice(-2)
    const monthExt = new Intl.DateTimeFormat('pt-BR', {month: 'long'}).format(timestamp)
    const year = date.getFullYear()
    const hour = date.getHours()
    const minutes = `0${date.getMinutes()}`.slice(-2)

    return {
      day,
      month,
      monthExt,
      year,
      hour,
      minutes,
      iso:`${year}-${month}-${day}`,
      birthDay: `${day}/${month}`
    }
  },

  formatPrice(price){
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price/100)
  },

  formatCpfCnpj(cpf_cnpj){
    if(cpf_cnpj.length > 11){
      //cnpj - 99.999.999/9999-99 (14)
      value = cpf_cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d)/,"$1.$2.$3/$4-$5") 

    }else{
      //cpf - 999.999.999-99 (11)
      value = cpf_cnpj.replace(/(\d{3})(\d{3})(\d{3})(\d)/,"$1.$2.$3-$4")

    }

    return value
  },
  formatCep(cep){
    value = cep.replace(/(\d{5})(\d)/,"$1-$2") //99999-999

    return value
  },
}
